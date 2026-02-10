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

    if (!message) {
      return res.status(400).json({ error: "No message" });
    }

    const completion = await openrouter.chat.send({
      model: "deepseek/deepseek-r1-0528:free",
      chatGenerationParams: {
        messages: [
          {
            role: "system",
            content: "You are a safe AI companion inside Roblox."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 200
      }
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "I'm here for you.";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("FULL ERROR:", err);
    return res.status(500).json({
      error: "AI error",
      details: err.message
    });
  }
}
