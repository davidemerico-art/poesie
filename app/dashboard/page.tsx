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
    <div className="relative min-h-screen p-6 overflow-hidden">
      
      {/*  SFONDO */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ 
          backgroundImage: "url('https://img.freepik.com/foto-premium/un-libro-aperto-con-farfalle-che-volano-sopra-di-esso_818261-2019.jpg?w=360')" 
        }}
      ></div>

      {/*  CONTENUTO */}
      <div className="relative z-10">
        
        <h1 className="text-3xl font-bold mb-6">Scegli una categoria</h1>

        <div className="grid grid-cols-2 gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => selectCategory(cat)}
              className="p-4 bg-yellow-100 rounded-xl hover:bg-yellow-200"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pulsante poesie salvate */}
        <div className="mt-8">
          <button
            onClick={() => router.push("/poesie-salvate")}
            className="bg-amber-600 text-white px-4 py-2 rounded shadow hover:bg-amber-700"
          >
            Vai a tutte le poesie salvate
          </button>
        </div>

        <button
          onClick={logout}
          className="mt-6 bg-amber-900 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>
    </div>
  );
}