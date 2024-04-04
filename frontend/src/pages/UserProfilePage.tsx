import {
  useFetchUserProfileDetails,
  useUpdateUserProfile,
} from "@/api/MyUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";

const UserProfilePage = () => {
  //renaming isLoading in both hooks because of TS which gets confuse because of two varibles of same name

  const { updateProfile, isLoading: isUpdateLoading } = useUpdateUserProfile();
  const { userProfile, isLoading: isGetLoading } = useFetchUserProfileDetails();

  if (isGetLoading) {
    return <span>Loading...</span>;
  }

  if (!userProfile) {
    return <span>Unable to load user profile</span>;
  }

  return (
    <UserProfileForm
      currentUser={userProfile}
      onSave={updateProfile}
      isLoading={isUpdateLoading}
    />
  );
};

export default UserProfilePage;
