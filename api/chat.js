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
chatGenerationParams: {
  model: "deepseek/deepseek-r1-0528:free",
  messages: [
    {
      role: "system",
      content: `
You are a friendly AI inside a Roblox game.
Reply in the same language as the user.
Keep answers very short (1-2 sentences max).
Be casual and natural, not formal.
Do not explain too much.
`
    },
    {
      role: "user",
      content: message
    }
  ],
  max_tokens: 70
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
