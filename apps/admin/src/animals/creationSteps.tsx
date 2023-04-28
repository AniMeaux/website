import { Steps } from "~/core/controllers/steps";

const STEPS = ["profile", "situation", "pictures"] as const;
type ActiveStep = (typeof STEPS)[number];

export function AnimalCreationSteps({
  activeStep,
}: {
  activeStep: ActiveStep;
}) {
  return (
    <Steps activeIndex={STEPS.indexOf(activeStep)}>
      <Steps.Step to="/animals/new/profile">Profile</Steps.Step>
      <Steps.Step to="/animals/new/situation">Situation</Steps.Step>
      <Steps.Step to="/animals/new/pictures">Photos</Steps.Step>
    </Steps>
  );
}
