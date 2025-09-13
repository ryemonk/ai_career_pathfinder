export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { career } = req.body;

  if (!career) {
    return res.status(400).json({ error: "Career is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a career guidance assistant." },
          { role: "user", content: `Explain why ${career} is a stable, future-proof career in North America.` }
        ]
      })
    });

    const data = await response.json();
    const explanation = data.choices?.[0]?.message?.content || "No explanation available.";

    res.status(200).json({ explanation });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch explanation" });
  }
}
