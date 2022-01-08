import { UserGroup } from "@animeaux/shared";
import { IconBaseProps } from "react-icons";
import {
  FaClinicMedical,
  FaFileAlt,
  FaHandshake,
  FaPaw,
  FaShieldAlt,
} from "react-icons/fa";

const USER_GROUP_ICONS: Record<UserGroup, React.ElementType> = {
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
  const Icon = USER_GROUP_ICONS[userGroup];
  return <Icon {...rest} />;
}
