import type { ServicePrisma } from "#i/core/prisma.service.server.js";
import orderBy from "lodash.orderby";
import invariant from "tiny-invariant";

export class ServiceSponsor {
  // eslint-disable-next-line no-useless-constructor
  constructor(private prisma: ServicePrisma) {}

  async getManyVisible() {
    const sponsorsRaw = await this.prisma.showSponsor.findMany({
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
            logoPath: true,
            name: true,
            links: true,
          },
        },
      },
    });

    const sponsors = sponsorsRaw.map((sponsor) => {
      if (sponsor.exhibitor != null) {
        const [url] = sponsor.exhibitor.links;
        invariant(url != null, "exhibitor should have at least one link");

        return {
          id: sponsor.id,
          logoPath: sponsor.exhibitor.logoPath,
          name: sponsor.exhibitor.name,
          url,
        };
      }

      invariant(sponsor.logoPath != null, "sponsor should have a logo");
      invariant(sponsor.name != null, "sponsor should have a name");
      invariant(sponsor.url != null, "sponsor should have an URL");

      return {
        id: sponsor.id,
        logoPath: sponsor.logoPath,
        name: sponsor.name,
        url: sponsor.url,
      };
    });

    return orderBy(sponsors, (sponsor) => sponsor.name, "asc");
  }
}
