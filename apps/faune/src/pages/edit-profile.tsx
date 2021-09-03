import { Navigation } from "core/layouts/navigation";
import { PageComponent } from "core/types";
import { CurrentUserProfileForm } from "user/currentUserProfile";

const EditProfile: PageComponent = () => {
  return (
    <CurrentUserProfileForm>
      <Navigation onlyLargeEnough />
    </CurrentUserProfileForm>
  );
};

export default EditProfile;
