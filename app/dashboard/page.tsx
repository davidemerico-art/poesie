"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [poems, setPoems] = useState<any[]>([]);

  const categories = [
    "Amore ",
    "Nostalgia ",
    "Tristezza ",
    "Felicità ",
    "Natura ",
    "Sogni ",
    "Mistero ",
    "Passione ",
    "Solitudine ",
    "Riflessione ",
    "Speranza ",
    "Rabbia "
  ];

  useEffect(() => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      router.push("/login");
      return;
    }

    loadPoems();
  }, []);

  const loadPoems = () => {
    const saved = JSON.parse(localStorage.getItem("poems") || "[]");
    setPoems(saved);
  };

  const selectCategory = (cat: string) => {
    localStorage.setItem("category", cat);
    router.push("/write");
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  return (
    <div className="min-h-screen p-6">

      <h1 className="text-3xl font-bold mb-6">Scegli una categoria</h1>

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


      {/* Pulsante per poesie salvate */}
      <div className="mt-8">
        <button
          onClick={() => router.push("/poesie-salvate")}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Vai a tutte le poesie salvate
        </button>
      </div>

      <button
        onClick={logout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

    </div>
  );
}