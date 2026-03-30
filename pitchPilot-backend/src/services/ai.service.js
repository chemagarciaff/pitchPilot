import openai from "../openai.js";

export async function generateClientReply({ scenario, messages }) {
  const instructions = `
Eres un cliente potencial de una inmobiliaria en una simulación comercial.

Perfil del cliente:
${scenario.customerProfile}

Contexto del inmueble:
${scenario.propertyContext}

Objeciones posibles:
${JSON.stringify(scenario.objections)}

Reglas:
- Habla como una persona real, no como un asistente.
- Sé natural, breve y conversacional.
- No des feedback.
- No rompas el personaje.
- Introduce objeciones de forma realista.
- Si el comercial lo hace bien, avanza.
- Si lo hace mal, duda o enfría el interés.
`;

  const input = messages.map((msg) => ({
    role: msg.role === "ASSISTANT" ? "assistant" : "user",
    content: msg.content,
  }));

  const response = await openai.responses.create({
    model: "gpt-5.4",
    instructions,
    input,
    store: false,
  });

  return response.output_text;
}

export async function evaluateConversation({ scenario, transcript }) {
  const response = await openai.responses.create({
    model: "gpt-5.4",
    instructions: `
Eres un evaluador experto en ventas inmobiliarias.

Analiza la conversación entre un comercial y un cliente potencial.

Criterios de éxito:
${JSON.stringify(scenario.successCriteria)}

Evalúa de 0 a 100:
- discovery
- empathy
- objection_handling
- closing

Devuelve feedback muy concreto y útil para un dashboard visual.
`,
    input: `Transcripción:\n\n${transcript}`,
    text: {
      format: {
        type: "json_schema",
        name: "simulation_feedback",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            score_total: { type: "integer" },
            scores: {
              type: "object",
              additionalProperties: false,
              properties: {
                discovery: { type: "integer" },
                empathy: { type: "integer" },
                objection_handling: { type: "integer" },
                closing: { type: "integer" }
              },
              required: ["discovery", "empathy", "objection_handling", "closing"]
            },
            strengths: {
              type: "array",
              items: { type: "string" }
            },
            mistakes: {
              type: "array",
              items: { type: "string" }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            summary: { type: "string" },
            chartData: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  label: { type: "string" },
                  value: { type: "integer" }
                },
                required: ["label", "value"]
              }
            }
          },
          required: [
            "score_total",
            "scores",
            "strengths",
            "mistakes",
            "recommendations",
            "summary",
            "chartData"
          ]
        }
      }
    },
    store: false,
  });

  return JSON.parse(response.output_text);
}