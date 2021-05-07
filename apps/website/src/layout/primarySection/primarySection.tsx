import cn from "classnames";
import * as React from "react";
import { Image, ImageProps } from "~/dataDisplay/image";
import { CenteredContent } from "~/layout/centeredContent";
import { Section } from "~/layout/section";
import { CallToAction, CallToActionProps } from "../callToAction";

export type PrimarySectionProps = {
  title: string;
  message: string;
  image: React.ReactNode;
  action: React.ReactNode;
  backgroundImage: string;
  reversed?: boolean;
};

export function PrimarySection({
  title,
  message,
  image,
  action,
  backgroundImage,
  reversed = false,
}: PrimarySectionProps) {
  return (
    <Section>
      <CenteredContent>
        <section
          className={cn("PrimarySection", {
            "PrimarySection--reversed": reversed,
          })}
        >
          <header className="PrimarySectionHeader" style={{ backgroundImage }}>
            <h2 className="PrimarySectionTitle">{title}</h2>
            <p className="PrimarySectionMessage">{message}</p>
            {action}
          </header>

          {image}
        </section>
      </CenteredContent>
    </Section>
  );
}

export function PrimarySectionImage(props: ImageProps) {
  return <Image {...props} className="PrimarySectionImage" />;
}

export type PrimarySectionActionProps = Omit<CallToActionProps, "color">;
export function PrimarySectionAction(props: PrimarySectionActionProps) {
  return (
    <CallToAction {...props} color="blue" className="PrimarySectionAction" />
  );
}
