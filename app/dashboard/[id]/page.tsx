import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PoesiaDettaglio({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [poesia, setPoesia] = useState<any>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("poems") || "[]");
    const idx = parseInt(params.id, 10);
    if (!saved[idx]) {
      router.push("/dashboard");
      return;
    }
    setPoesia(saved[idx]);
  }, [params.id, router]);

  if (!poesia) return <div className="p-6">Caricamento...</div>;

  // Qui puoi aggiungere logica per analisi e significato
  const analisi = "Analisi automatica della poesia (da implementare o integrare con AI).";
  const significato = "Significato della poesia (da implementare o integrare con AI).";

  return (
    <div className="min-h-screen p-6">
      <button onClick={() => router.push("/dashboard")} className="mb-4 text-purple-600">&larr; Torna indietro</button>
      <h1 className="text-2xl font-bold mb-2">Dettaglio poesia</h1>
      <p className="text-sm text-gray-500">Categoria: {poesia.category}</p>
      <p className="mt-2 whitespace-pre-line">{poesia.text}</p>
      <p className="text-xs text-gray-400 mt-1">{poesia.date}</p>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Analisi</h2>
        <p>{analisi}</p>
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Significato</h2>
        <p>{significato}</p>
      </div>
    </div>
  );
}
