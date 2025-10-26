import { db } from "#core/db.server";
import { assertCurrentUserHasGroups } from "#current-user/groups.server";
import { InvoiceStatus } from "#show/invoice/status.js";
import { withAllowedCategories } from "#show/stand-size/allowed-categories.js";
import { UserGroup } from "@animeaux/prisma/server";
import { safeParseRouteParam } from "@animeaux/zod-utils";
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
        activityFields: true,
        activityTargets: true,
        appetizerPeopleCount: true,
        billingAddress: true,
        billingCity: true,
        billingCountry: true,
        billingZipCode: true,
        breakfastPeopleCountSaturday: true,
        breakfastPeopleCountSunday: true,
        category: true,
        chairCount: true,
        description: true,
        descriptionStatus: true,
        descriptionStatusMessage: true,
        dividerCount: true,
        dividerType: { select: { label: true } },
        documentStatus: true,
        documentStatusMessage: true,
        dogsConfigurationStatus: true,
        dogsConfigurationStatusMessage: true,
        folderId: true,
        hasCorner: true,
        hasElectricalConnection: true,
        hasTableCloths: true,
        id: true,
        installationDay: true,
        isOrganizer: true,
        isOrganizersFavorite: true,
        isRisingStar: true,
        isVisible: true,
        links: true,
        locationNumber: true,
        logoPath: true,
        name: true,
        onStandAnimations: true,
        onStandAnimationsStatus: true,
        onStandAnimationsStatusMessage: true,
        peopleCount: true,
        perksStatus: true,
        perksStatusMessage: true,
        placementComment: true,
        publicProfileStatus: true,
        publicProfileStatusMessage: true,
        standConfigurationStatus: true,
        standConfigurationStatusMessage: true,
        standNumber: true,
        tableCount: true,
        token: true,

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

        size: {
          select: {
            id: true,
            label: true,
            maxBraceletCount: true,
            maxDividerCount: true,
            maxPeopleCount: true,
            maxTableCount: true,
            priceForAssociations: true,
            priceForServices: true,
            priceForShops: true,
          },
        },

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
      },
    }),

    application: db.show.exhibitor.application.findUniqueByExhibitor(
      routeParams.id,
      {
        select: {
          contactEmail: true,
          contactFirstname: true,
          contactLastname: true,
          contactPhone: true,
          id: true,
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

      size: withAllowedCategories(exhibitor.size),

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
