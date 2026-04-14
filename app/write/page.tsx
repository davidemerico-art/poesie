"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Figure = {
  name: string;
  explanation: string;
  location?: string;
};

type AnalysisResult = {
  figures: Figure[];
  meaning: string;
};

export default function Write() {
  const [title, setTitle] = useState("");
  const [poem, setPoem] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [category, setCategory] = useState("");
  const router = useRouter();

  //  Protezione + categoria
  useEffect(() => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      router.push("/login");
    }

    const cat = localStorage.getItem("category");
    if (cat) setCategory(cat);
  }, [router]);

  //  Analisi poesia con ia(api route)
  const analyzePoem = async () => {
    if (!poem.trim()) return;

    try {
      setIsAnalyzing(true);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ poem, category }),
      });

      const data = await res.json();
      setResult({
        figures: Array.isArray(data?.figures) ? data.figures : [],
        meaning: data?.meaning || "Errore durante l'analisi",
      });
    } catch (error) {
      console.error(error);
      setResult({
        figures: [],
        meaning: "Errore durante l'analisi",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  //  Salvataggio poesia 
  const savePoem = () => {
    if (!title.trim()) {
      alert("Inserisci il titolo della poesia.");
      return;
    }

    const poems = JSON.parse(localStorage.getItem("poems") || "[]");

    const newPoem = {
      title: title.trim(),
      text: poem,
      category,
      date: new Date().toLocaleString(),
      analysis: result,
    };

    poems.push(newPoem);
    localStorage.setItem("poems", JSON.stringify(poems));

    alert("Poesia salvata!");
    setTitle("");
    setPoem("");
  };

  return (
    <div className="min-h-screen p-6">
      
      <h1 className="text-2xl font-bold mb-4">
        Categoria: {category}
      </h1>

      {/* Titolo */}
      <input
        className="w-full p-3 border rounded mb-3"
        placeholder="Titolo della poesia"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Textarea */}
      <textarea
        className="w-full h-40 p-3 border rounded"
        placeholder="Scrivi la tua poesia..."
        value={poem}
        onChange={(e) => setPoem(e.target.value)}
      />

      {/* Bottoni */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={analyzePoem}
          disabled={isAnalyzing}
          className="bg-amber-600 text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? "Analisi in corso..." : "Analizza"}
        </button>

        <button
          onClick={savePoem}
          className="bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Salva
        </button>
      </div>

      {/* Risultato */}
      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Figure retoriche:</h2>
          <ul>
            {result.figures.map((f, i: number) => (
              <li key={i}>
                <strong>{f.name}</strong>
                {f.location ? ` (${f.location})` : ""}: {f.explanation}
              </li>
            ))}
          </ul>

          <h2 className="font-bold mt-4">Significato:</h2>
          <p>{result.meaning}</p>
        </div>
      )}

    </div>
  );
}