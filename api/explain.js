export default async function handler(req, res) {
  const { career } = req.query;
  const apiKey = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a career counselor AI." },
        { role: "user", content: `Give me a 3-sentence explanation of why someone might enjoy a career as a ${career}, highlighting stability, growth, and low AI risk.` }
      ]
    })
  });

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "No explanation available.";
  res.status(200).json({ explanation: text });
}
