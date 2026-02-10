import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message" });
    }

    const completion = await openrouter.chat.send({
      model: "deepseek/deepseek-r1-0528:free",
      messages: [
        {
          role: "system",
          content: `
You are a supportive AI companion inside a Roblox game.

Rules:
- Reply in the same language as the user.
- Be polite, calm, and emotionally supportive.
- Keep responses short and appropriate for all ages.
- Never generate sexual, violent, hateful, or explicit content.
- Do not give dangerous instructions.
- If the user mentions self-harm or serious distress, encourage them to talk to a trusted adult.
- Never ask for personal information.

Keep responses under 3 sentences.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 200,
    });

    const reply = completion.choices?.[0]?.message?.content || "I'm here for you.";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("AI ERROR:", err);
    return res.status(500).json({ error: "AI error" });
  }
}
