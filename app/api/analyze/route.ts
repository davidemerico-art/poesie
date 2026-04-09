import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { poem, category } = await req.json();

    if (!poem || poem.trim() === "") {
      return NextResponse.json({
        figures: [],
        meaning: "Nessuna poesia fornita",
      });
    }

    const prompt = `
Analizza questa poesia italiana.

POESIA:
${poem}

CATEGORIA:
${category}

Rispondi in modo semplice e chiaro.

IMPORTANTE:
- Trova le figure retoriche presenti
- Spiega il significato della poesia

Rispondi SOLO in questo formato:

FIGURE:
- nome: spiegazione

SIGNIFICATO:
testo del significato
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Sei un professore di letteratura italiana molto bravo a spiegare poesie in modo semplice.",
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

    console.log("OPENAI RESPONSE:", data);

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return NextResponse.json({
        figures: [],
        meaning: "Errore: risposta vuota dall'AI",
      });
    }

    //  PARSING SEMPLICE 
    const parts = text.split("SIGNIFICATO:");

    const figuresRaw = parts[0]?.replace("FIGURE:", "").trim();
    const meaning = parts[1]?.trim() || "Nessun significato trovato";

    const figures =
      figuresRaw
        ?.split("\n")
        .filter((line: string) => line.includes("-"))
        .map((line: string) => {
          const clean = line.replace("-", "").split(":");
          return {
            name: clean[0]?.trim() || "Figura",
            explanation: clean[1]?.trim() || "",
          };
        }) || [];

    return NextResponse.json({
      figures,
      meaning,
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json({
      figures: [],
      meaning: "Errore del server",
    });
  }
}