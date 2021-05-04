import { Navigation } from "core/navigation";
import { PageComponent } from "core/pageComponent";
import { CurrentUserProfileForm } from "entities/user/currentUserProfile";

const EditProfile: PageComponent = () => {
  return (
    <CurrentUserProfileForm>
      <Navigation onlyLargeEnough />
    </CurrentUserProfileForm>
  );
};

export default EditProfile;
