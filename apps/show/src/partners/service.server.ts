import { prisma } from "#core/prisma.server";
import { Service } from "#core/services/service.server";
import orderBy from "lodash.orderby";
import invariant from "tiny-invariant";

export class ServicePartner extends Service {
  async getManyVisible() {
    const partnersRaw = await prisma.showPartner.findMany({
      where: {
        isVisible: true,
        OR: [{ exhibitorId: null }, { exhibitor: { isVisible: true } }],
      },
      select: {
        id: true,
        logoPath: true,
        name: true,
        url: true,

        exhibitor: {
          select: {
            profile: {
              select: {
                logoPath: true,
                name: true,
                links: true,
              },
            },
          },
        },
      },
    });

    const partners = partnersRaw.map((partner) => {
      if (partner.exhibitor != null) {
        invariant(
          partner.exhibitor.profile != null,
          "exhibitor should have a profile",
        );

        const [url] = partner.exhibitor.profile.links;
        invariant(url != null, "exhibitor should have at least one link");

        return {
          id: partner.id,
          logoPath: partner.exhibitor.profile.logoPath,
          name: partner.exhibitor.profile.name,
          url,
        };
      }

      invariant(partner.logoPath != null, "partner should have a logo");
      invariant(partner.name != null, "partner should have a name");
      invariant(partner.url != null, "partner should have an URL");

      return {
        id: partner.id,
        logoPath: partner.logoPath,
        name: partner.name,
        url: partner.url,
      };
    });

    return orderBy(partners, (partner) => partner.name, "asc");
  }
}
