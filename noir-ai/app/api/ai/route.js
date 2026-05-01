import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt, mode } = body;

    // =========================
    // VALIDATION
    // =========================
    if (!prompt || prompt.trim() === "") {
      return Response.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // =========================
    // PERSONA MODE
    // =========================
    let persona = "";

    if (mode === "savage") {
      persona = `
You are JEN in SAVAGE MODE.

You are brutally honest, sharp, and highly critical.
You challenge weak thinking and expose flaws.

Tone:
- Direct
- Bold
- Precise
- Controlled

Rules:
- No insults
- No emotional outbursts
- Stay intelligent and composed
`;
    } else if (mode === "ceo") {
      persona = `
You are JEN in CEO MODE.

You think like a top-level strategist and advisor.
You analyze deeply and communicate with clarity.

Tone:
- Professional
- Structured
- Insightful
- Decisive
`;
    } else {
      persona = `
You are JEN in SOFT MODE.

You guide the user with clarity and encouragement.
You remain intelligent but approachable.

Tone:
- Warm
- Supportive
- Clear
- Thoughtful
`;
    }

    // =========================
    // STRICT SYSTEM PROMPT
    // =========================
    const systemPrompt = `
${persona}

You MUST follow this EXACT structure.

OUTPUT FORMAT:

Insight:
<1-3 clear sentences>

Opportunity:
<1-3 clear sentences>

Risk:
<1-3 clear sentences>

Strategic Move:
- Step 1: ...
- Step 2: ...
- Step 3: ...
- Step 4: ...

Final Verdict:
<1 strong sentence>

Next Question:
<1 sharp question>

STRICT RULES:
- No typos
- No repeated letters
- No broken words
- No random symbols
- Use proper grammar
- Do NOT rename sections
- Do NOT skip sections
- Do NOT add extra sections
- Strategic Move MUST use bullet format
- Keep output clean and professional

If the response is not clean, rewrite it before sending.
`;

    // =========================
    // API CALL
    // =========================
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        top_p: 0.9,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // =========================
    // RAW RESULT
    // =========================
    const raw =
      response.data?.choices?.[0]?.message?.content ||
      "No response generated.";

    // =========================
    // CLEANING FUNCTION (ANTI TYPO FINAL)
    // =========================
    const cleanText = (text) => {
      return text
        // hapus huruf berulang (coooool → cool)
        .replace(/([a-zA-Z])\1{2,}/g, "$1$1")

        // hapus simbol aneh
        .replace(/[^\x00-\x7F]+/g, "")

        // rapihin titik
        .replace(/\.{2,}/g, ".")

        // rapihin spasi
        .replace(/\s+/g, " ")

        // rapihin newline
        .replace(/\n\s*\n/g, "\n\n")

        .trim();
    };

    const result = cleanText(raw);

    // =========================
    // RESPONSE
    // =========================
    return Response.json({ result });

  } catch (error) {
    console.error("AI ERROR:", error?.response?.data || error.message);

    return Response.json(
      {
        error: "AI processing failed",
      },
      { status: 500 }
    );
  }
}