import { getItems } from "@/data/items";
import MenuItemsTable from "@/app/admin/ui/menu-items-table";

export default async function Admin() {

  const { items } = await getItems();

  return (
        <div className="flex flex-col gap-8">

            <MenuItemsTable items={items} />

      </div>
  );

}
