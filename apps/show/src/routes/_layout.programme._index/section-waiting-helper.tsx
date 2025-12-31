import { BoardCard } from "#i/core/layout/board-card";
import { Section } from "#i/core/layout/section";

export function SectionWaitingHelper() {
  return (
    <Section.Root columnCount={1}>
      <Section.TextAside asChild>
        <BoardCard>
          <h2 className="text-mystic text-title-item">
            En pleine effervescence
          </h2>

          <p>
            Nous sommes en plein préparatif pour vous offrir un programme
            d’animations exceptionnel lors de notre prochain salon. Nos équipes
            travaillent avec passion pour créer des expériences captivantes,
            éducatives et divertissantes qui raviront petits et grands amoureux
            des animaux.
          </p>

          <p>
            Restez connectés, car très bientôt, nous vous dévoilerons en
            exclusivité le programme complet de nos activités. Soyez prêts à
            plonger dans un univers de découvertes et de moments inoubliables
            avec nos amis à quatre pattes !
          </p>

          <p>
            N’hésitez pas à nous solliciter si vous souhaitez proposer une
            animation.
          </p>
        </BoardCard>
      </Section.TextAside>
    </Section.Root>
  );
}
