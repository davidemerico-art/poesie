"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PoemDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [poem, setPoem] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      router.push("/login");
      return;
    }

    const poems = JSON.parse(localStorage.getItem("poems") || "[]");
    const selected = poems[Number(id)];

    if (selected) {
      setPoem(selected);
      generateAnalysis(selected.text, selected.category);
    }
  }, []);

  // logica analisi
  const generateAnalysis = (text: string, category: string) => {
    const lower = text.toLowerCase();
    const lines = text.split(/\n|\r/);
    const figures = [];

    // Figure retoriche principali
    const figureDefs = [
      {
        name: "Similitudine",
        regex: /come|sembra|pare|quale|simile a/gi,
        explain: "Confronto esplicito tra due elementi tramite 'come', 'sembra', ecc.",
      },
      {
        name: "Metafora",
        regex: /cuore|fiume di|mare di|montagna di|un sole|un oceano/gi,
        explain: "Sostituzione di un termine con un altro in base a una somiglianza implicita.",
      },
      {
        name: "Anafora",
        regex: /^(\w.+)\s*$/gim,
        explain: "Ripetizione di una o più parole all'inizio di versi o frasi successive.",
        custom: (lines: string[]) => {
          // Trova parole ripetute all'inizio di versi
          const firstWords = lines.map(l => l.trim().split(" ")[0]?.toLowerCase()).filter(Boolean);
          const counts: Record<string, number> = {};
          firstWords.forEach(w => { counts[w] = (counts[w] || 0) + 1; });
          return Object.entries(counts).filter(([_, c]) => c > 1).map(([w]) => w);
        },
      },
      {
        name: "Allitterazione",
        regex: /([b-df-hj-np-tv-z])\1{1,}/gi,
        explain: "Ripetizione di suoni o lettere simili all'inizio o all'interno di parole vicine.",
      },
      {
        name: "Personificazione",
        regex: /parla|sorride|piange|cammina|danza|abbraccia/gi,
        explain: "Attribuzione di caratteristiche umane a oggetti o concetti astratti.",
      },
      {
        name: "Ossimoro",
        regex: /silenzio assordante|buio luminoso|dolce amarezza|ghiaccio bollente/gi,
        explain: "Accostamento di due termini di senso opposto.",
      },
      {
        name: "Iperbole",
        regex: /mille volte|infinito|mai più|sempre|tutto il mondo/gi,
        explain: "Esagerazione per eccesso o per difetto.",
      },
    ];

    // Rileva figure e posizione
    let foundFigures: any[] = [];
    figureDefs.forEach(fig => {
      if (fig.custom) {
        const matches = fig.custom(lines);
        matches.forEach((w: string) => {
          foundFigures.push({
            name: fig.name,
            position: `Ripetizione di '${w}' all'inizio di più versi`,
            explain: fig.explain,
          });
        });
      } else {
        lines.forEach((line, idx) => {
          const matches = line.match(fig.regex);
          if (matches) {
            foundFigures.push({
              name: fig.name,
              position: `Verso ${idx + 1}: "${line.trim()}"`,
              explain: fig.explain,
            });
          }
        });
      }
    });

    // Analisi tema
    let tema = "vita";
    if (/(amore|bacio|abbraccio|cuore|passione)/.test(lower)) tema = "amore";
    else if (/(morte|addio|lacrima|tristezza|pianto)/.test(lower)) tema = "tristezza";
    else if (/(sogno|speranza|futuro|desiderio)/.test(lower)) tema = "speranza";
    else if (/(natura|fiore|albero|mare|cielo|sole|vento|pioggia)/.test(lower)) tema = "natura";
    else if (/(notte|solitudine|ombra|silenzio)/.test(lower)) tema = "solitudine";

    // Analisi emozione
    let emozione = "riflessione";
    if (/(gioia|felicità|sorriso|luce)/.test(lower)) emozione = "gioia";
    else if (/(paura|ansia|buio|angoscia)/.test(lower)) emozione = "paura";
    else if (/(rabbia|ira|fuoco)/.test(lower)) emozione = "rabbia";
    else if (/(pace|serenità|calma)/.test(lower)) emozione = "serenità";

    setAnalysis({
      figures: foundFigures,
      meaning: `Questa poesia parla di ${tema} e trasmette un senso di ${emozione}.`,
    });
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

      {analysis && (
        <div className="mt-6 p-4 bg-amber-100 shadow rounded">


          <h2 className="font-bold">Figure retoriche trovate:</h2>
          {analysis.figures.length === 0 && <p>Nessuna figura retorica rilevata.</p>}
          <ul className="list-disc ml-5">
            {analysis.figures.map((f: any, idx: number) => (
              <li key={idx} className="mb-2">
                <span className="font-semibold">{f.name}</span> — <span className="italic">{f.position}</span>
                <br />
                <span className="text-gray-500 text-sm">{f.explain}</span>
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