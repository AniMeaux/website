import { PageComponent } from "core/types";
import { CurrentUserProfileForm } from "entities/user/currentUserProfile";
import { Navigation } from "layouts/navigation";

const EditProfile: PageComponent = () => {
  return (
    <CurrentUserProfileForm>
      <Navigation onlyLargeEnough />
    </CurrentUserProfileForm>
  );
};

export default EditProfile;
