import { useUpdateUserProfile } from "@/api/MyUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";

const UserProfilePage = () => {
  const { updateProfile, isLoading } = useUpdateUserProfile();
  return <UserProfileForm onSave={updateProfile} isLoading={isLoading} />;
};

export default UserProfilePage;
