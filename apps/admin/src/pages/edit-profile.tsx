import { CurrentUserProfileForm, PageComponent } from "@animeaux/app-core";
import { Navigation } from "../core/navigation";

const EditProfile: PageComponent = () => {
  return (
    <CurrentUserProfileForm>
      <Navigation onlyLargeEnough />
    </CurrentUserProfileForm>
  );
};

export default EditProfile;
