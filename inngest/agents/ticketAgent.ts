import { createAgent, gemini } from "@inngest/agent-kit";

const extractJSON = (text: string) => {
  // remove ```json ``` if present
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in AI response");

  return JSON.parse(match[0]);
};

const analyzeTicket = async (ticket: any) => {
  console.log("🟡 analyzeTicket called with:", ticket);

  const supportAgent = createAgent({
    name: "AI Ticket Triage Assistant",
    model: gemini({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY!,
    }),

    // ❗ PROMPT UNCHANGED
    system: `
You are an expert AI assistant that processes technical support tickets.

Your job is to:
1. Summarize the issue.
2. Estimate its priority.
3. Provide helpful notes and resource links for human moderators.
4. List relevant technical skills required.

IMPORTANT:
- Respond with ONLY valid raw JSON.
- Do NOT include markdown, code fences, or extra text.
- Output must be a pure JSON object.

The JSON format MUST be:

{
  "summary": "Short summary of the issue",
  "priority": "low | medium | high",
  "helpfulNotes": "Detailed technical explanation and tips",
  "relatedSkills": ["React", "Node.js"]
}
`,
  });

  const prompt = `
Analyze the following support ticket:

Title: ${ticket.title}
Description: ${ticket.description}

Return ONLY valid JSON. Do not add any explanation or markdown.
`;

  console.log("📨 AI PROMPT SENT:\n", prompt);

  const response = await supportAgent.run(prompt);

  // ✅ CORRECT WAY TO READ OUTPUT
  let raw = ""

   for (const msg of response.output ?? []) {
    if (msg.type === "text") {
      raw += msg.content;
    }
  }

  console.log("🧠 RAW AI OUTPUT:\n", raw);

  try {
    const parsed = extractJSON(raw);
    console.log("✅ PARSED AI JSON:", parsed);
    return parsed;
  } catch (err) {
    console.error("❌ JSON Parse Failed");
    console.error(raw);

    // ✅ SAFE FALLBACK (important)
    return {
      summary: ticket.title,
      priority: "low",
      helpfulNotes:
        "AI response could not be parsed correctly. Manual review required.",
      relatedSkills: ["General"],
    };
  }
};

export default analyzeTicket;
