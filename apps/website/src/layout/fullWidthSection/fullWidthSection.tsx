import { CenteredContent } from "~/layout/centeredContent";
import { Section } from "~/layout/section";
import { CallToAction, CallToActionProps } from "../callToAction";

type FullWidthSectionProps = {
  title: string;
  message: React.ReactNode;
  action: React.ReactNode;
};

export function FullWidthSection({
  title,
  message,
  action,
}: FullWidthSectionProps) {
  return (
    <Section>
      <section className="FullWidthSection">
        <CenteredContent className="FullWidthSection__centeredContent">
          <div>
            <h2 className="FullWidthSection__Title">{title}</h2>
            <p className="FullWidthSection__Message">{message}</p>
            {action}
          </div>
        </CenteredContent>
      </section>
    </Section>
  );
}

export type FullWidthSectionActionProps = Omit<CallToActionProps, "color">;
export function FullWidthSectionAction(props: FullWidthSectionActionProps) {
  return (
    <CallToAction {...props} color="blue" className="FullWidthSectionAction" />
  );
}
