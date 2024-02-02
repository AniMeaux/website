import type { ImageDescriptor } from "#core/data-display/image";
import socialAdoptionConditions1024 from "#images/social-adoption-conditions-1024w.jpg";
import socialDefault1024 from "#images/social-default-1024w.jpg";
import socialDonation1024 from "#images/social-donation-1024w.jpg";
import socialFaq1024 from "#images/social-faq-1024w.jpg";
import socialFosterFamily1024 from "#images/social-foster-family-1024w.jpg";
import socialVolunteer1024 from "#images/social-volunteer-1024w.jpg";

const adoptionConditions: ImageDescriptor = {
  alt: "Chat escaladant une petite grille.",
  imagesBySize: { "1024": socialAdoptionConditions1024 },
};

const socialDefault: ImageDescriptor = {
  alt: "Ani’Meaux.",
  imagesBySize: { "1024": socialDefault1024 },
};

const donation: ImageDescriptor = {
  alt: "De la monnaie dans un bocal.",
  imagesBySize: { "1024": socialDonation1024 },
};

const faq: ImageDescriptor = {
  alt: "Chien qui lève la patte.",
  imagesBySize: { "1024": socialFaq1024 },
};

const fosterFamily: ImageDescriptor = {
  alt: "Homme portant un chat dans les bras.",
  imagesBySize: { "1024": socialFosterFamily1024 },
};

const volunteer: ImageDescriptor = {
  alt: "Deux volontaires de dos avec des t-shirts Ani’Meaux.",
  imagesBySize: { "1024": socialVolunteer1024 },
};

export const socialImages = {
  adoptionConditions,
  default: socialDefault,
  donation,
  faq,
  fosterFamily,
  volunteer,
};
