import { Step, Steps } from "~/core/controllers/steps";

const STEPS = ["profile", "situation", "pictures"] as const;
type ActiveStep = typeof STEPS[number];

export function AnimalCreationSteps({
  activeStep,
}: {
  activeStep: ActiveStep;
}) {
  return (
    <Steps activeIndex={STEPS.indexOf(activeStep)}>
      <Step to="/animals/new/profile">Profile</Step>
      <Step to="/animals/new/situation">Situation</Step>
      <Step to="/animals/new/pictures">Photos</Step>
    </Steps>
  );
}
