import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ChatMessage from "../components/ChatMessage";
import { api } from "../api/client";

export default function SimulationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSimulation();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [simulation?.messages]);

  async function loadSimulation() {
    try {
      setLoading(true);
      const data = await api.getSimulation(id);
      setSimulation(data);
    } catch (err) {
      setError(err.message || "No se pudo cargar la simulación");
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setSending(true);
      setError("");

      const newUserMessage = {
        id: Date.now(),
        role: "USER",
        content: message,
      };

      setSimulation((prev) => ({
        ...prev,
        messages: [...prev.messages, newUserMessage],
      }));

      const currentMessage = message;
      setMessage("");

      const result = await api.sendMessage(id, currentMessage);

      setSimulation((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: Date.now() + 1,
            role: "ASSISTANT",
            content: result.reply,
          },
        ],
      }));
    } catch (err) {
      setError(err.message || "No se pudo enviar el mensaje");
      await loadSimulation();
    } finally {
      setSending(false);
    }
  }

  async function handleEndSimulation() {
    try {
      setEnding(true);
      await api.endSimulation(id);
      navigate(`/simulation/${id}/feedback`);
    } catch (err) {
      setError(err.message || "No se pudo finalizar la simulación");
    } finally {
      setEnding(false);
    }
  }

  if (loading) {
    return (
      <Layout title="Simulación">
        <Loader text="Cargando simulación..." />
      </Layout>
    );
  }

  if (!simulation) {
    return (
      <Layout title="Simulación">
        <div className="error-box">Simulación no encontrada</div>
      </Layout>
    );
  }

  return (
    <Layout title={simulation.scenario?.title || "Simulación"}>
      <div className="simulation-layout">
        <section className="card simulation-side">
          <h3>Contexto del escenario</h3>

          <div className="info-block">
            <span className="info-label">Descripción</span>
            <p>{simulation.scenario?.description}</p>
          </div>

          <div className="info-block">
            <span className="info-label">Cliente</span>
            <p>{simulation.scenario?.customerProfile}</p>
          </div>

          <div className="info-block">
            <span className="info-label">Inmueble</span>
            <p>{simulation.scenario?.propertyContext}</p>
          </div>

          <div className="info-block">
            <span className="info-label">Objetivo</span>
            <ul>
              {simulation.scenario?.successCriteria?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <button className="button button-danger w-full" onClick={handleEndSimulation} disabled={ending}>
            {ending ? "Generando feedback..." : "Finalizar simulación"}
          </button>
        </section>

        <section className="card chat-panel">
          <div className="chat-messages">
            {simulation.messages?.length === 0 ? (
              <div className="empty-chat">
                Empieza la conversación. Presenta el inmueble y detecta la necesidad del cliente.
              </div>
            ) : (
              simulation.messages.map((msg, index) => (
                <ChatMessage key={`${msg.id}-${index}`} role={msg.role} content={msg.content} />
              ))
            )}

            {sending && (
              <div className="chat-row chat-row-assistant">
                <div className="chat-bubble chat-bubble-assistant">
                  <div className="chat-label">Cliente</div>
                  <div>Escribiendo...</div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && <div className="error-box mt-12">{error}</div>}

          <form className="chat-form" onSubmit={handleSendMessage}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje al cliente..."
              rows={4}
              disabled={sending || ending}
            />
            <button className="button" disabled={sending || ending || !message.trim()}>
              {sending ? "Enviando..." : "Enviar"}
            </button>
          </form>
        </section>
      </div>
    </Layout>
  );
}