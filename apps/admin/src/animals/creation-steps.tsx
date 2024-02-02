import { Steps } from "#core/controllers/steps";
import { Routes } from "#core/navigation";

const STEPS = ["profile", "situation", "pictures"] as const;
type ActiveStep = (typeof STEPS)[number];

export function AnimalCreationSteps({
  activeStep,
}: {
  activeStep: ActiveStep;
}) {
  return (
    <Steps activeIndex={STEPS.indexOf(activeStep)}>
      <Steps.Step to={Routes.animals.new.profile.toString()}>
        Profile
      </Steps.Step>
      <Steps.Step to={Routes.animals.new.situation.toString()}>
        Situation
      </Steps.Step>
      <Steps.Step to={Routes.animals.new.pictures.toString()}>
        Photos
      </Steps.Step>
    </Steps>
  );
}
