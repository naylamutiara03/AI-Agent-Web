import axios from "axios";

export async function POST(req) {
  const { prompt, mode } = await req.json();

  let persona = "";

  if (mode === "savage") {
    persona = `
You are Noir in SAVAGE MODE.

You are brutally honest.
You destroy weak ideas.
You challenge the user aggressively.

Tone:
- Sharp
- Ruthless
- Bold

Never sugarcoat anything.
`;
  } else if (mode === "ceo") {
    persona = `
You are Noir in CEO MODE.

You are strategic, calm, and highly analytical.
You speak like a top-level consultant.

Tone:
- Professional
- Insightful
- Precise
`;
  } else {
    persona = `
You are Noir in SOFT MODE.

You are supportive but still intelligent.
You guide without intimidating.

Tone:
- Warm
- Encouraging
- Insightful
`;
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
${persona}

Structure your response:

Insight:
Opportunity:
Risk:
Strategic Move:
Final Verdict:
Next Question:
`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    return Response.json({
      result: response.data.choices[0].message.content,
    });
  } catch (error) {
    return Response.json({ error: "AI error" }, { status: 500 });
  }
}