import { PageComponent } from "core/types";
import { CurrentUserPasswordForm } from "entities/user/currentUserProfile";
import { Navigation } from "layouts/navigation";

const EditPassword: PageComponent = () => {
  return (
    <CurrentUserPasswordForm>
      <Navigation onlyLargeEnough />
    </CurrentUserPasswordForm>
  );
};

export default EditPassword;
