export async function POST(req: Request) {
  const { message, mode, history = [] } = await req.json();

  const systemPrompts = {
    DSA: `You are an expert DSA interview coach.
Guide step-by-step, ask questions, give hints, and analyze time/space complexity.
Keep explanations simple and structured.`,

    Backend: `You are a Backend interview coach.
Focus on:
- APIs, REST, scalability
- Authentication (JWT, OAuth)
- Databases, caching, queues
- System performance and trade-offs

Structure answers:
1. Concept explanation
2. Real-world example
3. Best practices
4. Common mistakes
5. Follow-up questions`,

    Frontend: `You are a Frontend interview coach.
Focus on:
- React, state management
- Performance optimization
- UI/UX best practices
- Browser behavior

Structure:
1. Concept
2. Example
3. Code snippet (if useful)
4. Optimization tips
5. Edge cases`,

    "System Design": `You are a System Design interview coach.
Follow:
1. Requirements
2. High-level design
3. Components
4. Trade-offs
5. Scaling & bottlenecks

Always think in real-world scalable systems.`,

    Database: `You are a Database interview coach.
Focus on:
- SQL vs NoSQL
- Indexing, normalization
- Query optimization
- Transactions & ACID

Explain with examples and trade-offs.`,

    Other: `You are a general software engineering interview coach.
Give clear, structured, and helpful answers.
Keep responses simple and practical.`,
  };

  const systemPrompt =
    systemPrompts[mode as keyof typeof systemPrompts] || systemPrompts.DSA;

  const messages = [
    {
      role: "system",
      content: systemPrompt,
    },
    ...(history || []).slice(-10).map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: "user",
      content: message,
    },
  ];
  console.log("process.env.OPENROUTER_API_KEY", process.env.OPENROUTER_API_KEY);
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 1500,
        messages: messages,
        presence_penalty: 0.6,
        frequency_penalty: 0.5,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("OpenAI API error:", error);
    return Response.json(
      { error: "Failed to get response from AI. Please try again." },
      { status: response.status },
    );
  }

  const data = await response.json();

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error("Unexpected API response structure:", data);
    return Response.json(
      { error: "Invalid response from AI" },
      { status: 500 },
    );
  }

  return Response.json({
    reply: data.choices[0].message.content,
    usage: data.usage,
  });
}
