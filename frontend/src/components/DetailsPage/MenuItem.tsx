import { MenuItem as MenuItemType } from "@/types"; //renaming for naming conflict between file name and type name
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

type Props = {
  menuItem: MenuItemType;
  addToCart: () => void;
};

const MenuItem = ({ menuItem, addToCart }: Props) => {
  return (
    <Card className="grid grid-cols-[4fr_2fr]">
      <div>
        <CardHeader>
          <CardTitle>{menuItem.name}</CardTitle>
        </CardHeader>

        <CardContent className="font-bold">₹ {menuItem.price}</CardContent>
      </div>

      <div className="flex justify-end items-center mr-10">
        <Button variant="outline" size="icon" onClick={addToCart}>
          <Plus />
        </Button>
      </div>
    </Card>
  );
};

export default MenuItem;

{
  /* <CardContent className="font-bold flex justify-between items-center">
        <span>₹ {menuItem.price}</span>
        <Button variant="outline" size="icon">
          <Plus />
        </Button>
      </CardContent> */
}
