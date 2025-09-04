import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { InvoiceStatus } from "#show/invoice/status.js";
import { safeParseRouteParam } from "@animeaux/zod-utils";
import { UserGroup } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { promiseHash } from "remix-utils/promise";
import { routeParamsSchema } from "./route-params";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const currentUser = await db.currentUser.get(request, {
    select: { groups: true },
  });

  assertCurrentUserHasGroups(currentUser, [
    UserGroup.ADMIN,
    UserGroup.SHOW_ORGANIZER,
  ]);

  const routeParams = safeParseRouteParam(routeParamsSchema, params);

  const { exhibitor, application, files, sponsor } = await promiseHash({
    exhibitor: db.show.exhibitor.findUnique(routeParams.id, {
      select: {
        id: true,
        isVisible: true,
        token: true,
        documentStatus: true,
        documentStatusMessage: true,
        folderId: true,
        dogsConfigurationStatus: true,
        dogsConfigurationStatusMessage: true,
        dogs: {
          orderBy: { createdAt: "desc" },
          select: {
            gender: true,
            id: true,
            idNumber: true,
            isCategorized: true,
            isSterilized: true,
          },
        },
        activityFields: true,
        activityTargets: true,
        description: true,
        descriptionStatus: true,
        descriptionStatusMessage: true,
        links: true,
        logoPath: true,
        name: true,
        onStandAnimations: true,
        onStandAnimationsStatus: true,
        onStandAnimationsStatusMessage: true,
        publicProfileStatus: true,
        publicProfileStatusMessage: true,
        chairCount: true,
        dividerCount: true,
        dividerType: true,
        hasElectricalConnection: true,
        hasTablecloths: true,
        installationDay: true,
        invoices: {
          orderBy: { createdAt: "desc" },
          select: {
            amount: true,
            dueDate: true,
            id: true,
            number: true,
            status: true,
            url: true,
          },
        },
        locationNumber: true,
        peopleCount: true,
        placementComment: true,
        size: { select: { id: true, label: true } },
        standNumber: true,
        standConfigurationStatus: true,
        standConfigurationStatusMessage: true,
        tableCount: true,

        animations: {
          orderBy: { startTime: "asc" },
          select: {
            animators: {
              orderBy: { name: "asc" },
              select: { id: true, name: true },
            },
            description: true,
            endTime: true,
            id: true,
            registrationUrl: true,
            startTime: true,
            targets: true,
            zone: true,
          },
        },
      },
    }),

    application: db.show.exhibitor.application.findUniqueByExhibitor(
      routeParams.id,
      {
        select: {
          id: true,
          contactEmail: true,
          contactFirstname: true,
          contactLastname: true,
          contactPhone: true,
          status: true,
          structureAddress: true,
          structureCity: true,
          structureCountry: true,
          structureLegalStatus: true,
          structureLegalStatusOther: true,
          structureSiret: true,
          structureZipCode: true,
        },
      },
    ),

    files: db.show.exhibitor.getFiles(routeParams.id),

    sponsor: db.show.sponsor.findUniqueByExhibitor(routeParams.id, {
      select: {
        id: true,
        category: true,
      },
    }),
  });

  return json({
    exhibitor: {
      ...exhibitor,
      ...files,

      invoiceStatus:
        exhibitor.invoices.length === 0
          ? null
          : exhibitor.invoices.some(
                (invoice) => invoice.status === InvoiceStatus.Enum.TO_PAY,
              )
            ? InvoiceStatus.Enum.TO_PAY
            : InvoiceStatus.Enum.PAID,
    },
    application,
    sponsor,
  });
}
