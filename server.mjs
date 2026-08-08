import express from "express";
import OpenAI from "openai";

const app = express();

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/ai", async (req, res) => {
  try {
    const prompt = String(req.body.prompt || "");

    if (!prompt.trim()) {
      return res.status(400).json({
        error: "Empty prompt"
      });
    }

    const response = await openai.responses.create({
      model: "gpt-5",
      instructions: `
You are a Roblox AI Builder.

The user describes something they want to build in Roblox.

Generate complete Roblox Luau code.

Rules:
- Return ONLY Luau code.
- No Markdown.
- No explanations.
- Use Roblox APIs correctly.
- Decide whether Script or LocalScript is needed.
- If both are needed, separate them with comments:
-- SCRIPT
-- LOCALSCRIPT
`,
      input: prompt
    });

    res.json({
      code: response.output_text
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI request failed"
    });
  }
});

app.get("/", (req, res) => {
  res.send("🤖 Roblox AI Builder is online!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("AI Builder running on port " + PORT);
});
