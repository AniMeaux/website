import orderBy from "lodash.orderby";

export type CityWithAgreements = {
  id: string;
  name: string;
  image: string;
};

export const citiesWithAgreements: CityWithAgreements[] = orderBy(
  [
    {
      id: "19adc2b2-2100-4f96-a92b-e8d589e4f87a",
      name: "Lagny-sur-Marne",
      image: "cities-with-agreements/lagny-sur-marne-vrz1m29oxdz0l18kmaoa",
    },
    {
      id: "ed797ccd-e70c-4782-a22d-eb01d833af37",
      name: "Lycée du Gué à Tresmes",
      image:
        "cities-with-agreements/lyceee-du-gue-a-tresmes-saldcmeh5p28lo1gm7ot",
    },
    {
      id: "9ada9d8c-ec12-44aa-87fb-bda6817c85f5",
      name: "Meaux",
      image: "cities-with-agreements/meaux-q7wehjwiq9mbzwkdyewe",
    },
    {
      id: "882fa007-13fb-4e88-8147-e6a029764073",
      name: "Villenoy",
      image: "cities-with-agreements/villenoy-rrzty95tbnggot0s8tyj",
    },
  ],
  (city) => city.name.toLowerCase(),
);
