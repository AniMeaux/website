import { Navigation } from "core/layouts/navigation";
import { PageComponent } from "core/types";
import { CurrentUserPasswordForm } from "user/currentUserProfile";

const EditPassword: PageComponent = () => {
  return (
    <CurrentUserPasswordForm>
      <Navigation onlyLargeEnough />
    </CurrentUserPasswordForm>
  );
};

export default EditPassword;
