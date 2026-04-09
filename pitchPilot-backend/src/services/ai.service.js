import openai from "../openai.js";

export async function generateClientReply({ scenario, company, messages }) {
  const instructions = `
Eres un cliente potencial de una inmobiliaria en una simulación comercial.

CONTEXTO DE EMPRESA
Nombre: ${company.name}
Descripción del negocio: ${company.businessDescription}
Cliente objetivo: ${company.targetCustomer}
Proceso comercial: ${company.salesProcess}
Propuesta de valor: ${company.valueProposition}
Objeciones habituales: ${JSON.stringify(company.commonObjections)}
Competidores: ${JSON.stringify(company.competitors)}
Guía de tono comercial: ${company.toneGuidelines}
Objetivos comerciales: ${JSON.stringify(company.goals)}

ESCENARIO
Título: ${scenario.title}
Descripción: ${scenario.description || ""}
Perfil del cliente: ${scenario.customerProfile}
Contexto del inmueble: ${scenario.propertyContext}
Objeciones posibles del escenario: ${JSON.stringify(scenario.objections)}

REGLAS
- Habla como una persona real, no como un asistente.
- Sé natural, breve y conversacional.
- Introduce objeciones de forma creíble.
- Reacciona según la calidad comercial del vendedor.
- Si el vendedor lo hace bien, avanza.
- Si lo hace mal, duda, enfría o bloquea.
- No des feedback.
- No rompas el personaje.
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

export async function evaluateConversation({ scenario, company, transcript }) {
  const response = await openai.responses.create({
    model: "gpt-5.4",
    instructions: `
Eres un sales coach experto en ventas inmobiliarias.

Evalúa una conversación comercial teniendo en cuenta el contexto de empresa y el escenario.

CONTEXTO DE EMPRESA
Nombre: ${company.name}
Descripción del negocio: ${company.businessDescription}
Cliente objetivo: ${company.targetCustomer}
Proceso comercial: ${company.salesProcess}
Propuesta de valor: ${company.valueProposition}
Objeciones habituales: ${JSON.stringify(company.commonObjections)}
Competidores: ${JSON.stringify(company.competitors)}
Guía de tono comercial: ${company.toneGuidelines}
Objetivos comerciales: ${JSON.stringify(company.goals)}

ESCENARIO
Título: ${scenario.title}
Descripción: ${scenario.description || ""}
Perfil del cliente: ${scenario.customerProfile}
Contexto del inmueble: ${scenario.propertyContext}
Criterios de éxito: ${JSON.stringify(scenario.successCriteria)}

Evalúa en clave de ventas reales:
- discovery
- empathy
- objection_handling
- closing

Devuelve feedback concreto, accionable y útil para un dashboard visual.
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