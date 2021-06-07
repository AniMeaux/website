import { Navigation } from "ui/layouts/navigation";
import { PageComponent } from "core/types";
import { CurrentUserProfileForm } from "entities/user/currentUserProfile";

const EditProfile: PageComponent = () => {
  return (
    <CurrentUserProfileForm>
      <Navigation onlyLargeEnough />
    </CurrentUserProfileForm>
  );
};

export default EditProfile;
