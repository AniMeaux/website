import { Navigation } from "ui/layouts/navigation";
import { PageComponent } from "core/types";
import { CurrentUserPasswordForm } from "entities/user/currentUserProfile";

const EditPassword: PageComponent = () => {
  return (
    <CurrentUserPasswordForm>
      <Navigation onlyLargeEnough />
    </CurrentUserPasswordForm>
  );
};

export default EditPassword;
