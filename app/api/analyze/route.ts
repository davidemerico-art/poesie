import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { poem, category } = await req.json();

  const prompt = `
Analizza questa poesia:

"${poem}"

Categoria: ${category}

Restituisci:
- Figure retoriche (nome + spiegazione)
- Significato

Formato JSON:
{
  "figures": [
    { "name": "", "explanation": "" }
  ],
  "meaning": ""
}
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "Sei un esperto di poesia." },
        { role: "user", content: prompt }
      ],
    }),
  });

  const data = await response.json();

  try {
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({
      figures: [],
      meaning: "Errore nell'analisi"
    });
  }
}