import { Navigation } from "core/navigation";
import { PageComponent } from "core/pageComponent";
import { CurrentUserPasswordForm } from "entities/user/currentUserProfile";

const EditPassword: PageComponent = () => {
  return (
    <CurrentUserPasswordForm>
      <Navigation onlyLargeEnough />
    </CurrentUserPasswordForm>
  );
};

export default EditPassword;
