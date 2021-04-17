import { CurrentUserPasswordForm, PageComponent } from "@animeaux/app-core";
import { Navigation } from "../core/navigation";

const EditPassword: PageComponent = () => {
  return (
    <CurrentUserPasswordForm>
      <Navigation onlyLargeEnough />
    </CurrentUserPasswordForm>
  );
};

export default EditPassword;
