import { getItems } from "@/data/items";
import Menu from "@/app/ui/menu";

export default async function Home() {

  const { items } = await getItems();

  return (
    <div className="flex flex-col min-h-screen size-full max-w-5xl mx-auto">
      <header className="p-4 text-center">
        <h1 className="text-2xl font-bold uppercase text-green-400">Menu</h1>
      </header>
      <main className="flex-1 flex flex-col">
        <Menu items={items} />
      </main>
      <footer className="px-2 py-8">
        <p className="text-xs text-white/50 text-center">Eat fresh or something</p>
      </footer>
    </div>
  );
}