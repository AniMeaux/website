import { actionClassNames } from "#i/core/actions";
import { BaseLink } from "#i/core/base-link";
import {
  bubbleSectionClassNames,
  BubbleShape,
} from "#i/core/layout/bubble-section";
import { cn } from "@animeaux/core";

export function DonationSection() {
  return (
    <section className={bubbleSectionClassNames.root()}>
      <span className={bubbleSectionClassNames.bubbleContainer()}>
        <BubbleShape isDouble />
      </span>

      <div
        className={cn(
          bubbleSectionClassNames.content(),
          "flex flex-col items-center gap-6 px-10 py-12",
          "md:px-30 md:py-[60px]",
        )}
      >
        <div className="flex w-full flex-col gap-6 text-center">
          <h2
            className={cn(
              "text-title-section-small",
              "md:text-title-section-large",
            )}
          >
            Faîtes un don !
          </h2>

          <p>
            Vous souhaitez nous aider mais vous ne pouvez accueillir ou adopter
             ? Vous pouvez nous faire un don ! Ce don servira à financer les{" "}
            <strong className="text-body-emphasis">soins vétérinaires</strong>,
            effectuer plus de{" "}
            <strong className="text-body-emphasis">
              sauvetages et acheter du matériel
            </strong>{" "}
            pour les animaux.
          </p>
        </div>

        <BaseLink
          to="/faire-un-don"
          className={actionClassNames.standalone({ color: "yellow" })}
        >
          Faire un don
        </BaseLink>
      </div>
    </section>
  );
}
