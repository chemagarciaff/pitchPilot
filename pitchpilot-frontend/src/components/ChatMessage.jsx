export default function ChatMessage({ role, content }) {
  const isUser = role === "USER";

  return (
    <div className={`chat-row ${isUser ? "chat-row-user" : "chat-row-assistant"}`}>
      <div className={`chat-bubble ${isUser ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
        <div className="chat-label">{isUser ? "Tú" : "Cliente"}</div>
        <div>{content}</div>
      </div>
    </div>
  );
}