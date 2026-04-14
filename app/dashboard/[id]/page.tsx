"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Figure = {
  name: string;
  explanation: string;
  location?: string;
};

type Analysis = {
  figures: Figure[];
  meaning: string;
};

type Poem = {
  title?: string;
  text: string;
  category?: string;
  date?: string;
  analysis?: Analysis;
};

export default function PoemDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [poem, setPoem] = useState<Poem | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const hasAutoAnalyzed = useRef(false);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      router.push("/login");
      return;
    }

    const poems = JSON.parse(localStorage.getItem("poems") || "[]") as Poem[];
    const poemIndex = Number(id);
    const selected = poems[poemIndex];

    if (selected) {
      setPoem(selected);
      if (selected.analysis) {
        setAnalysis(selected.analysis);
      } else if (!hasAutoAnalyzed.current) {
        hasAutoAnalyzed.current = true;
        void analyzeWithAI(selected, poemIndex);
      }
    }
  }, [id, router]);

  const analyzeWithAI = async (selected: Poem, poemIndex: number) => {
    try {
      setIsAnalyzing(true);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          poem: selected.text,
          category: selected.category || "",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setAnalysis((prev) => ({
            figures: prev?.figures || [],
            meaning:
              "Hai fatto troppe richieste in poco tempo (429). Aspetta 20-30 secondi e riprova con 'Rianalizza'.",
          }));
          return;
        }

        setAnalysis({
          figures: [],
          meaning: data?.meaning || "Errore durante l'analisi AI",
        });
        return;
      }

      const nextAnalysis: Analysis = {
        figures: Array.isArray(data?.figures) ? data.figures : [],
        meaning: data?.meaning || "Errore durante l'analisi",
      };

      setAnalysis(nextAnalysis);

      // Salva sempre l'ultima analisi della poesia anche per quelle gia salvate
      const poems = JSON.parse(localStorage.getItem("poems") || "[]") as Poem[];
      if (poems[poemIndex]) {
        poems[poemIndex] = {
          ...poems[poemIndex],
          analysis: nextAnalysis,
        };
        localStorage.setItem("poems", JSON.stringify(poems));
      }
    } catch (error) {
      console.error(error);
      setAnalysis({
        figures: [],
        meaning: "Errore durante l'analisi AI",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!poem) return <p className="p-6">Caricamento...</p>;

  return (
    <div className="min-h-screen p-6">
      

      <button
        onClick={() => router.push("/dashboard")}
        className="mb-4 bg-yellow-500 text-white px-4 py-2 rounded"
      >
        ← Torna indietro
      </button>

      <h1 className="text-2xl font-bold mb-2">
        Categoria: {poem.category}
      </h1>

      <div className="p-4 bg-amber-100 rounded whitespace-pre-line">
        {poem.text}
      </div>

      <button
        onClick={() => void analyzeWithAI(poem, Number(id))}
        disabled={isAnalyzing}
        className="mt-4 bg-amber-700 text-white px-4 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? "Analisi AI in corso..." : "Rianalizza con AI"}
      </button>

      {isAnalyzing && (
        <p className="mt-4 text-amber-800">Analisi AI in corso...</p>
      )}

      {analysis && (
        <div className="mt-6 p-4 bg-amber-100 shadow rounded">


          <h2 className="font-bold">Figure retoriche trovate:</h2>
          {analysis.figures.length === 0 && <p>Nessuna figura retorica rilevata.</p>}
          <ul className="list-disc ml-5">
            {analysis.figures.map((f, idx: number) => (
              <li key={idx} className="mb-2">
                <span className="font-semibold">{f.name}</span>
                <br />
                {f.location && (
                  <>
                    <span className="text-sm text-amber-900">{f.location}</span>
                    <br />
                  </>
                )}
                <span className="text-gray-500 text-sm">{f.explanation}</span>
              </li>
            ))}
          </ul>

          <h2 className="font-bold mt-4">Significato:</h2>
          <p>{analysis.meaning}</p>

        </div>
      )}

    </div>
  );
}