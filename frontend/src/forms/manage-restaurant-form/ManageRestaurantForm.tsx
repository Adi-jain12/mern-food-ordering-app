import { z } from "zod";

const formSchema = z.object({
  restaurantName: z.string({
    required_error: "Restaurant Name is required",
  }),

  city: z.string({
    required_error: "City is required",
  }),
  country: z.string({
    required_error: "Country is required",
  }),
  deliveryPrice: z.coerce.number({
    //when inputting value in form they are in html form elements, so the input value is always a string so coerce func is to convert string to number
    required_error: "Delivery Price is required",
    invalid_type_error: "Must be a valid number",
  }),
  estimatedDeliveryTime: z.coerce.number({
    required_error: "Estimated Delivery Time is required",
    invalid_type_error: "Must be a valid number",
  }),

  //because cuisines contains an array of strings
  cuisines: z.array(z.string()).nonempty({
    message: "Please select at least one item",
  }),

  //because menuItems is an array of objects with name and price field in it
  menuItems: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      price: z.coerce.number().min(1, "Price is required"),
    })
  ),
});

type Props = {
  onSave: (restaurantFormData: FormData) => void;
  isLoading: boolean;
};

const ManageRestaurantForm = ({ onSave, isLoading }: Props) => {};

export default ManageRestaurantForm;
