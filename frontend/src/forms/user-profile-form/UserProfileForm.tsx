import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"; //Framework for advance validation on form

// inside object we can specify all the properties the form has
const formSchema = z.object({
  email: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  addressLine1: z.string().min(1, "AddressLine1 is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});

// zod will automatically detect the properties and the type and assign it to the type UserFormData
type UserFormData = z.infer<typeof formSchema>;

type Props = {
  onSave: (userProfileData: UserFormData) => void;
  isLoading: boolean;
};
const UserProfileForm = ({ onSave, isLoading }: Props) => {
  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema), //resolver is basically used for handling validation and stuff. Here making use of and connecting zod formSchema to react hook form as it has validation messages
  });
};

export default UserProfileForm;
