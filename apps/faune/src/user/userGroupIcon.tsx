import { UserGroup } from "@animeaux/shared-entities";
import { IconBaseProps } from "react-icons";
import {
  FaClinicMedical,
  FaFileAlt,
  FaHandshake,
  FaPaw,
  FaShieldAlt,
} from "react-icons/fa";

const UserGroupIcons: { [key in UserGroup]: React.ElementType } = {
  [UserGroup.ADMIN]: FaShieldAlt,
  [UserGroup.ANIMAL_MANAGER]: FaPaw,
  [UserGroup.BLOGGER]: FaFileAlt,
  [UserGroup.HEAD_OF_PARTNERSHIPS]: FaHandshake,
  [UserGroup.VETERINARIAN]: FaClinicMedical,
};

type UserGroupIconProps = IconBaseProps & {
  userGroup: UserGroup;
};

export function UserGroupIcon({ userGroup, ...rest }: UserGroupIconProps) {
  const Icon = UserGroupIcons[userGroup];
  return <Icon {...rest} />;
}
