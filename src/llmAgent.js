const OpenAI = require("openai");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

let client;
try {
  client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  console.log("client created successfully");
} catch (error) {
  console.error("client creation failed:", error);
  alert("client creation failed: " + error.message);
}

const DEFAULT_MODEL = "gpt-5-mini";

function buildInput(history, userMessage) {
  const items = history.map((msg) => ({
    role: msg.role,
    content: `[${msg.timestamp}] ${msg.content}`,
  }));

  if (userMessage && userMessage.trim()) {
    items.push({
      role: "user",
      content: `[${new Date().toISOString()}] ${userMessage.trim()}`,
    });
  }

  return items;
}

async function generateReply({
  systemPrompt,
  history,
  userMessage,
  model = DEFAULT_MODEL,
  maxOutputTokens = 800,
}) {
  if (!systemPrompt) {
    throw new Error("generateReply: systemPrompt is required");
  }

  if (!userMessage || !userMessage.trim()) {
    throw new Error("generateReply: userMessage is required");
  }

  if (!history) {
    history = [];
  }

    const response = await client.responses.create({
        model,
        instructions: systemPrompt,
        input: buildInput(history, userMessage),
        max_output_tokens: maxOutputTokens,
    });

  return {
    text: response.output_text?.trim() ?? "",
    raw: response,
  };
}

async function generateStructuredReply({
  systemPrompt,
  history = [],
  userMessage,
  schema,
  model = DEFAULT_MODEL,
  maxOutputTokens = 200,
}) {
  if (!schema) {
    throw new Error("generateStructuredReply: schema is required");
  }

  const response = await client.responses.create({
    model,
    instructions: systemPrompt,
    input: buildInput(history, userMessage),
    max_output_tokens: maxOutputTokens,
    text: {
      format: {
        type: "json_schema",
        name: "chert_response",
        strict: true,
        schema,
      },
    },
  });

  const text = response.output_text?.trim() ?? "{}";

  return {
    data: JSON.parse(text),
    raw: response,
  };
}

async function streamChertReply({
  systemPrompt,
  history = [],
  userMessage,
  model = DEFAULT_MODEL,
  maxOutputTokens = 120,
}) {
  return client.responses.create({
    model,
    instructions: systemPrompt,
    input: buildInput(history, userMessage),
    max_output_tokens: maxOutputTokens,
    stream: true,
  });
}

module.exports = {
  generateReply,
  generateStructuredReply,
  streamChertReply,
};
