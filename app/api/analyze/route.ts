import { NextResponse } from "next/server";

type Figure = {
  name: string;
  explanation: string;
  location?: string;
};

type AnalysisResponse = {
  figures: Figure[];
  meaning: string;
};

function buildLocalAnalysis(poem: string, category?: string): AnalysisResponse {
  const lower = poem.toLowerCase();
  const lines = poem
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const figures: Figure[] = [];
  const seen = new Set<string>();

  const addFigure = (figure: Figure) => {
    const key = `${figure.name}|${figure.location ?? ""}|${figure.explanation}`;
    if (seen.has(key)) return;
    seen.add(key);
    figures.push(figure);
  };

  lines.forEach((line, index) => {
    const verse = `Verso ${index + 1}: "${line}"`;
    const lineLower = line.toLowerCase();

    if (/\bcome\b|\bsembra\b|\bpare\b|\bquale\b|\bsimile a\b/.test(lineLower)) {
      addFigure({
        name: "Similitudine",
        location: verse,
        explanation: "Confronto esplicito tra due elementi con connettivi come 'come' o 'sembra'.",
      });
    }

    if (/\bmare di\b|\bfiume di\b|\bun sole\b|\bun oceano\b|\bsei un\b|\be una\b/.test(lineLower)) {
      addFigure({
        name: "Metafora",
        location: verse,
        explanation: "Sostituzione implicita di un termine con un'immagine simbolica.",
      });
    }

    if (/\bmille\b|\binfinito\b|\beterno\b|\bmai\b|\bsempre\b|\btutto il mondo\b/.test(lineLower)) {
      addFigure({
        name: "Iperbole",
        location: verse,
        explanation: "Esagerazione espressiva per aumentare intensita e impatto emotivo.",
      });
    }

    if (
      /(silenzio assordante|ghiaccio bollente|dolce amarezza|buio luminoso)/.test(
        lineLower
      )
    ) {
      addFigure({
        name: "Ossimoro",
        location: verse,
        explanation: "Accostamento di parole dal significato opposto.",
      });
    }

    if (/(vento|notte|mare|cielo|pioggia|tempo).*(piange|sorride|parla|abbraccia|grida)/.test(lineLower)) {
      addFigure({
        name: "Personificazione",
        location: verse,
        explanation: "Elemento non umano descritto con azioni o tratti umani.",
      });
    }
  });

  const firstWords = lines
    .map((line) => line.split(/\s+/)[0]?.toLowerCase())
    .filter(Boolean);
  const positionsByWord: Record<string, number[]> = {};
  firstWords.forEach((word, idx) => {
    positionsByWord[word] = positionsByWord[word] ?? [];
    positionsByWord[word].push(idx + 1);
  });
  Object.entries(positionsByWord).forEach(([word, positions]) => {
    if (positions.length > 1) {
      addFigure({
        name: "Anafora",
        location: `Inizio versi ${positions.join(", ")}`,
        explanation: `Ripetizione della parola '${word}' all'inizio di piu versi.`,
      });
    }
  });

  lines.forEach((line, index) => {
    const words = line
      .toLowerCase()
      .replace(/[^\p{L}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);
    for (let i = 0; i < words.length - 2; i += 1) {
      const a = words[i][0];
      if (a && words[i + 1][0] === a && words[i + 2][0] === a) {
        addFigure({
          name: "Allitterazione",
          location: `Verso ${index + 1}: "${line}"`,
          explanation: `Ripetizione del suono iniziale '${a}' in parole vicine.`,
        });
        break;
      }
    }
  });

  let theme = "riflessione personale";
  if (/\bamore\b|\bcuore\b|\bbacio\b|\bpassione\b/.test(lower)) theme = "amore";
  else if (/\bnatura\b|\bmare\b|\bcielo\b|\bvento\b|\bfiore\b/.test(lower)) theme = "natura";
  else if (/\bsolitudine\b|\bnotte\b|\bsilenzio\b|\bombra\b/.test(lower)) theme = "solitudine";
  else if (/\bdolore\b|\blacrime\b|\bpianto\b|\baddio\b/.test(lower)) theme = "dolore e perdita";

  const style =
    lines.length > 8
      ? "Il testo usa uno sviluppo piu ampio e riflessivo."
      : "Il testo e breve e diretto, con un tono personale.";

  let emotion = "meditativa";
  if (/\bgioia\b|\bfelice\b|\bluce\b|\bsorriso\b/.test(lower)) emotion = "positiva e luminosa";
  else if (/\bdolore\b|\blacrime\b|\btriste\b|\bvuoto\b/.test(lower)) emotion = "malinconica";
  else if (/\brabbia\b|\bfuoco\b|\bgrido\b/.test(lower)) emotion = "intensa e conflittuale";

  const voice =
    /\bio\b|\bmi\b|\bme\b/.test(lower)
      ? "Il testo sembra in prima persona, con coinvolgimento diretto dell'autore."
      : "Il testo sembra descrittivo, con un punto di vista piu osservativo.";

  const categoryHint = category?.trim()
    ? ` La categoria indicata e '${category.trim()}'.`
    : "";

  const figuresHint =
    figures.length > 0
      ? ` Sono state rilevate ${figures.length} figure retoriche con posizione del verso.`
      : " Non sono state trovate figure retoriche chiare con queste regole locali.";

  return {
    figures,
    meaning: `Analisi locale gratuita: la poesia tratta soprattutto il tema di ${theme} e comunica un'atmosfera ${emotion}.${categoryHint} ${voice} ${style}${figuresHint}`,
  };
}

export async function POST(req: Request) {
  try {
    const { poem, category } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    const useOpenAI = process.env.USE_OPENAI === "true";

    if (!poem || poem.trim() === "") {
      return NextResponse.json({
        figures: [],
        meaning: "Nessuna poesia fornita",
      });
    }

    // Modalita gratis/offline di default: nessun costo API.
    if (!useOpenAI || !apiKey) {
      return NextResponse.json(buildLocalAnalysis(poem, category));
    }

    const prompt = `
Analizza la seguente poesia in italiano.

POESIA:
${poem}

CATEGORIA (se presente):
${category || "non specificata"}

Obiettivi:
1) Elenca le figure retoriche trovate nella poesia.
2) Spiega in modo semplice di cosa parla la poesia.

Se non trovi figure retoriche, restituisci comunque un array vuoto.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "Sei un insegnante di letteratura italiana. Restituisci sempre e solo JSON valido con chiavi: figures, meaning. Ogni elemento di figures deve avere name, explanation e facoltativamente location (verso o porzione di testo).",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const apiError =
        data?.error?.message || "Errore sconosciuto durante la chiamata OpenAI";
      const apiErrorCode = data?.error?.code;

      if (response.status === 429 && apiErrorCode !== "insufficient_quota") {
        return NextResponse.json(buildLocalAnalysis(poem, category));
      }

      return NextResponse.json(
        {
          figures: [],
          meaning: `Errore OpenAI: ${apiError}`,
        },
        { status: response.status }
      );
    }

    console.log("OPENAI RESPONSE:", data);

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return NextResponse.json({
        figures: [],
        meaning: "Errore: risposta vuota dall'AI",
      });
    }

    let parsed: AnalysisResponse;

    try {
      const json = JSON.parse(text) as Partial<AnalysisResponse>;
      parsed = {
        figures: Array.isArray(json.figures)
          ? json.figures
              .filter(
                (f): f is Figure =>
                  Boolean(f && typeof f.name === "string" && typeof f.explanation === "string")
              )
              .map((f) => ({
                name: f.name.trim() || "Figura retorica",
                explanation: f.explanation.trim(),
                location: typeof f.location === "string" ? f.location.trim() : undefined,
              }))
          : [],
        meaning:
          typeof json.meaning === "string" && json.meaning.trim().length > 0
            ? json.meaning.trim()
            : "Non sono riuscito a determinare il significato della poesia.",
      };
    } catch {
      return NextResponse.json(
        {
          figures: [],
          meaning:
            "L'AI ha risposto in formato non valido. Riprova con una poesia leggermente piu lunga.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({
      figures: [],
      meaning: "Errore del server",
    });
  }
}