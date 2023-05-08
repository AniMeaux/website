import orderBy from "lodash.orderby";

export type CityWithAgreements = {
  id: string;
  name: string;
  image: string;
};

export const citiesWithAgreements: CityWithAgreements[] = orderBy(
  [
    {
      id: "6f955ec7-9973-4329-a8b5-14ba311d8f86",
      name: "Bassevelle",
      image: "cities-with-agreements/953d5aab-50b8-403f-bdad-0a4934374752.png",
    },
    {
      id: "19adc2b2-2100-4f96-a92b-e8d589e4f87a",
      name: "Lagny-sur-Marne",
      image: "cities-with-agreements/2bb806bf-8b57-4e24-8650-b1c00eeef331.png",
    },
    {
      id: "9ada9d8c-ec12-44aa-87fb-bda6817c85f5",
      name: "Meaux",
      image: "cities-with-agreements/6a3a9105-3f79-4750-ba40-1be3e3a2d43c.png",
    },
    {
      id: "7eaa6fe1-c9d0-4769-b6c3-5afa312ab46e",
      name: "Ocquerre",
      image: "cities-with-agreements/50f785d4-4b96-418c-b571-b9d816c1a392.png",
    },
    {
      id: "882fa007-13fb-4e88-8147-e6a029764073",
      name: "Villenoy",
      image: "cities-with-agreements/1e456eef-4cbb-43e6-b228-e89a9ff4ac9e.png",
    },
  ],
  (city) => city.name.toLowerCase()
);
