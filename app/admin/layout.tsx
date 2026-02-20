import React from "react";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
      <div className="flex flex-col min-h-screen bg-gray-900">
          <header className="bg-gray-950 p-8">
              <h1>Menu Builder</h1>
          </header>
          <main className="p-8">
              {children}
          </main>
      </div>
  );
}