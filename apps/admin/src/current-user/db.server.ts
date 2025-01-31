import { algolia } from "#core/algolia/algolia.server";
import { EmailAlreadyUsedError, PrismaErrorCodes } from "#core/errors.server";
import { setCurrentUserForMonitoring } from "#core/monitoring.server";
import { Routes } from "#core/navigation";
import { prisma } from "#core/prisma.server";
import { NextSearchParams } from "#core/search-params";
import {
  destroyCurrentUserSession,
  getCurrentUserSession,
} from "#current-user/session.server";
import { hasGroups } from "#users/groups";
import { generatePasswordHash, isSamePassword } from "@animeaux/password";
import type { User } from "@prisma/client";
import { Prisma, UserGroup } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { createPath } from "history";

export class CurrentUserDbDelegate {
  async get<T extends Prisma.UserSelect>(
    request: Request,
    args: { select: T },
    {
      skipPasswordChangeCheck = false,
    }: { skipPasswordChangeCheck?: boolean } = {},
  ) {
    const session = await getCurrentUserSession(request);
    if (session.data.userId == null) {
      throw await this.redirectToLogin(request);
    }

    const user = await prisma.$transaction(async (prisma) => {
      // For some reason, the type of the `user` object get messed up when
      // merging the internal and given `select`.
      // So what we do is:
      // - Cast the object to the internal properties for internal usages.
      // - Cast the object to the given properties for the return value.
      const internalSelect = {
        displayName: true,
        email: true,
        groups: true,
        id: true,
        shouldChangePassword: true,
      } satisfies Prisma.UserSelect;

      const user = (await prisma.user.findFirst({
        select: { ...args.select, ...internalSelect },
        where: { id: session.data.userId, isDisabled: false },
      })) as Prisma.UserGetPayload<{ select: typeof internalSelect }>;

      if (user == null) {
        throw await this.redirectToLogin(request);
      }

      await prisma.user.update({
        where: { id: session.data.userId },
        data: { lastActivityAt: new Date() },
      });

      return user;
    });

    if (
      !hasGroups(user, [
        UserGroup.ADMIN,
        UserGroup.ANIMAL_MANAGER,
        UserGroup.VETERINARIAN,
        UserGroup.VOLUNTEER,
      ])
    ) {
      throw await this.redirectToLogin(request);
    }

    setCurrentUserForMonitoring(user);

    if (!skipPasswordChangeCheck && user.shouldChangePassword) {
      throw await this.redirectToDefinePassword(request);
    }

    return user as Prisma.UserGetPayload<{ select: typeof args.select }>;
  }

  async verifyLogin({
    email,
    password,
  }: {
    email: User["email"];
    password: string;
  }) {
    const user = await prisma.user.findFirst({
      where: { email, isDisabled: false },
      select: { id: true, password: true, groups: true },
    });

    if (user?.password == null) {
      // Prevent finding out which emails exists through a timing attack.
      // We want to take approximately the same time to respond so we fake a
      // password comparison.
      await isSamePassword(
        "Hello there",
        // "Obiwan Kenobi?"
        "879d5935bab9b03280188c1806cf5ae751579b3342c51e788c43be14e0109ab8b98da03f5fa2cc96c85ca192eda9aaf892cba7ba1fc3b7d1a4a1eb8956a65c53.6a71cc1003ad30a5c6abf0d53baa2c5d",
      );

      return null;
    }

    if (!(await isSamePassword(password, user.password.hash))) {
      return null;
    }

    if (
      !hasGroups(user, [
        UserGroup.ADMIN,
        UserGroup.ANIMAL_MANAGER,
        UserGroup.VETERINARIAN,
        UserGroup.VOLUNTEER,
      ])
    ) {
      return null;
    }

    return user.id;
  }

  async updatePassword(userId: User["id"], password: string) {
    const passwordHash = await generatePasswordHash(password);

    await prisma.user.update({
      where: { id: userId },
      data: {
        shouldChangePassword: false,
        password: { update: { hash: passwordHash } },
      },
    });
  }

  async updateProfile(
    id: User["id"],
    data: Pick<User, "email" | "displayName">,
  ) {
    await prisma.$transaction(async (prisma) => {
      try {
        await prisma.user.update({ where: { id }, data });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
            throw new EmailAlreadyUsedError();
          }
        }

        throw error;
      }

      await algolia.user.update({ ...data, id });
    });
  }

  private async redirectToLogin(request: Request) {
    setCurrentUserForMonitoring(null);

    const path = this.getCurrentRoutePath(request);

    return redirect(
      createPath({
        pathname: Routes.login.toString(),
        search: NextSearchParams.format({ next: path }),
      }),
      { headers: { "Set-Cookie": await destroyCurrentUserSession() } },
    );
  }

  private async redirectToDefinePassword(request: Request) {
    const path = this.getCurrentRoutePath(request);

    return redirect(
      createPath({
        pathname: Routes.definePassword.toString(),
        search: NextSearchParams.format({ next: path }),
      }),
    );
  }

  private getCurrentRoutePath(request: Request) {
    // Remove host from URL.
    let path = createPath(new URL(request.url));

    // We don't want to redirect to resources routes as they don't render UI.
    if (path.startsWith("/resources/")) {
      path = "/";
    }

    return path;
  }
}
