import { useGetRestaurantDetails } from "@/api/RestaurantApi";
import MenuItem from "@/components/DetailsPage/MenuItem";
import RestaurantInfo from "@/components/DetailsPage/RestaurantInfo";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import { useParams } from "react-router-dom";

const DetailsPage = () => {
  const { restaurantId } = useParams();

  const { restaurantDetails, isLoading } =
    useGetRestaurantDetails(restaurantId);

  if (isLoading || !restaurantDetails) {
    return <span>Loading...</span>;
  }

  return (
    <div className="flex flex-col gap-10">
      <AspectRatio ratio={16 / 5}>
        <img
          src={restaurantDetails.imageUrl}
          className="rounded-md object-cover h-full w-full"
        />
      </AspectRatio>

      <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
        <div className="flex flex-col gap-4">
          <RestaurantInfo restaurant={restaurantDetails} />
          <span className="text-2xl font-bold tracking-tight">Menu</span>
          {restaurantDetails.menuItems.map((menuItem) => (
            <MenuItem menuItem={menuItem} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
