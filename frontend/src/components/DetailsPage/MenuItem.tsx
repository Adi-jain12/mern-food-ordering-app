import { MenuItem as MenuItems } from "@/types"; //renaming for naming conflict between file name and type name
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  menuItem: MenuItems;
};

const MenuItem = ({ menuItem }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{menuItem.name}</CardTitle>
      </CardHeader>

      <CardContent className="font-bold">₹ {menuItem.price}</CardContent>
    </Card>
  );
};

export default MenuItem;
