"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [poems, setPoems] = useState<any[]>([]);

  const categories = ["Amore ", "Nostalgia ", "Tristezza ", "Felicità ", "Natura ", "Sogni ", "Mistero ", "Passione ", "Solitudine ", "Riflessione ","speranza ","rabbia"];

  // Protezione pagina + carica poesie
  useEffect(() => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      router.push("/login");
    }

    const saved = JSON.parse(localStorage.getItem("poems") || "[]");
    setPoems(saved);
  }, []);

  //  Selezione categoria
  const selectCategory = (cat: string) => {
    localStorage.setItem("category", cat);
    router.push("/write");
  };

  //  Logout
  const logout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  return (
    <div className="min-h-screen p-6">
      
      <h1 className="text-3xl font-bold mb-6">Scegli una categoria</h1>

      {/* Categorie */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => selectCategory(cat)}
            className="p-4 bg-purple-100 rounded-xl hover:bg-purple-200"
          >
            {cat}
          </button>
        ))}
      </div>

      {/*  Lista poesie */}
      <h2 className="text-xl font-bold mt-8">Le tue poesie</h2>

      <div className="mt-4 space-y-3">
        {poems.length === 0 && (
          <p className="text-gray-500">Nessuna poesia salvata</p>
        )}

        {poems.map((p, i) => (
          <div
            key={i}
            className="p-3 bg-gray-100 rounded cursor-pointer hover:bg-purple-200"
            onClick={() => router.push(`/dashboard/${i}`)}
          >
            <p className="text-sm text-gray-500">{p.category}</p>
            <p>{p.text}</p>
            <p className="text-xs text-gray-400 mt-1">{p.date}</p>
          </div>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}