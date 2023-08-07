import { Prisma, User, UserGroup } from "@prisma/client";
import { redirect } from "@remix-run/node";
import { createPath } from "history";
import { algolia } from "~/core/algolia/algolia.server";
import { EmailAlreadyUsedError, PrismaErrorCodes } from "~/core/errors.server";
import { prisma } from "~/core/prisma.server";
import { NextSearchParams } from "~/core/searchParams";
import {
  destroyCurrentUserSession,
  getCurrentUserSession,
} from "~/currentUser/session.server";
import { hasGroups } from "~/users/groups";
import { generatePasswordHash, isSamePassword } from "~/users/password.server";

export class CurrentUserDbDelegate {
  async get<T extends Prisma.UserFindFirstArgs>(
    request: Request,
    args: Prisma.SelectSubset<T, Prisma.UserFindFirstArgs>,
    {
      skipPasswordChangeCheck = false,
    }: { skipPasswordChangeCheck?: boolean } = {}
  ) {
    const session = await getCurrentUserSession(request);
    if (session.data.userId == null) {
      throw await this.redirectToLogin(request);
    }

    const user = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.findFirst<T>({
        ...args,
        select: { ...args.select, shouldChangePassword: true, groups: true },
        where: { id: session.data.userId, isDisabled: false },
      });
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

    if (!skipPasswordChangeCheck && user.shouldChangePassword) {
      throw await this.redirectToDefinePassword(request);
    }

    return user;
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
        "879d5935bab9b03280188c1806cf5ae751579b3342c51e788c43be14e0109ab8b98da03f5fa2cc96c85ca192eda9aaf892cba7ba1fc3b7d1a4a1eb8956a65c53.6a71cc1003ad30a5c6abf0d53baa2c5d"
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
    userId: User["id"],
    data: Pick<User, "email" | "displayName">
  ) {
    await prisma.$transaction(async (prisma) => {
      try {
        await prisma.user.update({ where: { id: userId }, data });
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === PrismaErrorCodes.UNIQUE_CONSTRAINT_FAILED) {
            throw new EmailAlreadyUsedError();
          }
        }

        throw error;
      }

      await algolia.user.update(userId, { displayName: data.displayName });
    });
  }

  private async redirectToLogin(request: Request) {
    const path = this.getCurrentRoutePath(request);

    return redirect(
      createPath({
        pathname: "/login",
        search: NextSearchParams.stringify({ next: path }),
      }),
      { headers: { "Set-Cookie": await destroyCurrentUserSession() } }
    );
  }

  private async redirectToDefinePassword(request: Request) {
    const path = this.getCurrentRoutePath(request);

    return redirect(
      createPath({
        pathname: "/define-password",
        search: NextSearchParams.stringify({ next: path }),
      })
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
