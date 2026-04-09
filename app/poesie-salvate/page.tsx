"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PoesieSalvate() {
  const router = useRouter();
  const [poems, setPoems] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("poems") || "[]");
    setPoems(saved);
  }, []);

  const filteredPoems = poems.filter((p: any) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Poesie salvate</h1>

      {/* Barra di ricerca */}
      <input
        className="w-full p-2 mb-6 border rounded"
        placeholder="Cerca per titolo..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="space-y-4">
        {filteredPoems.length === 0 && <p>Nessuna poesia trovata</p>}
        {filteredPoems.map((p, i) => (
          <div
            key={i}
            className="p-4 bg-gray-100 rounded flex justify-between items-start hover:bg-purple-200"
          >
            <div className="flex-1 cursor-pointer" onClick={() => router.push(`/dashboard/${poems.indexOf(p)}`)}>
              <p className="text-lg font-bold text-purple-700">{p.title || "(Senza titolo)"}</p>
              <p className="text-sm text-gray-500">{p.category}</p>
              <p className="font-semibold">{p.text.slice(0, 60)}...</p>
              <p className="text-xs text-gray-400 mt-1">{p.date}</p>
            </div>
            <button
              className="ml-4 bg-red-400 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
              onClick={() => {
                const updated = poems.filter((_, idx) => idx !== poems.indexOf(p));
                localStorage.setItem("poems", JSON.stringify(updated));
                setPoems(updated);
              }}
            >
              Elimina
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
