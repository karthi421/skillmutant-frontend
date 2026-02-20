export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const response = await fetch(
      `${process.env.AI_BACKEND_URL}/ai/room-chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("AI proxy error:", error);
    return res.status(500).json({
      answer: "AI service unavailable."
    });
  }
}