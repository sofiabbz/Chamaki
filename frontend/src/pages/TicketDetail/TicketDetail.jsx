import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";
import "./TicketDetail.css";
import Toast from "../../components/Toast/Toast";

function TicketDetail() {
  const { id } = useParams();
  const [toast, setToast] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data);
      setStatus(response.data.status);
      setPriority(response.data.priority);
    } catch (err) {
      console.log("Erro ao buscar chamado");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.put(`/tickets/${id}`, { status: newStatus });
      setStatus(newStatus);
      setToast({ message: `Status alterado para "${newStatus}"`, type: "success" });
    } catch (err) {
      setToast({ message: "Erro ao atualizar status", type: "error" });
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      await api.put(`/tickets/${id}`, { priority: newPriority });
      setPriority(newPriority);
      setToast({ message: `Prioridade alterada para "${newPriority}"`, type: "success" });
    } catch (err) {
      setToast({ message: "Erro ao atualizar prioridade", type: "error" });
    }
  };

  const handleSendComment = async () => {
    if (newComment.trim() === "") return;

    try {
      await api.post(`/tickets/${id}/comments`, { text: newComment });
      setNewComment("");
      fetchTicket();
      setToast({ message: "Comentário adicionado!", type: "success" });
    } catch (err) {
      setToast({ message: "Erro ao enviar comentário", type: "error" });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  if (!ticket) {
    return (
      <div className="ticket-detail">
        <Sidebar type={user?.role === "tech" ? "tech" : "client"} />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
        <main className="ticket-main">
          <p>Carregando...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="ticket-detail">
      <Sidebar type={user?.role === "tech" ? "tech" : "client"} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="ticket-main">
        <Link
          to={user?.role === "tech" ? "/dashboard-tecnico" : "/dashboard"}
          className="ticket-back"
        >
          ← <span>Voltar aos chamados</span>
        </Link>

        <span className="ticket-id">#{String(ticket.id).padStart(3, "0")}</span>
        <h1 className="ticket-title">{ticket.title}</h1>

        <div className="ticket-badges">
          <span className={`badge badge-${status.toLowerCase().replace(" ", "-")}`}>
            {status}
          </span>
          <span className="badge badge-alta">{priority}</span>
          <span className="badge badge-hardware">{ticket.category}</span>
        </div>

        <div className="ticket-content">
          <div className="ticket-left">
            <div className="ticket-card">
              <h3 className="ticket-card-title">INFORMAÇÕES</h3>
              <div className="ticket-info-grid">
                <div>
                  <span className="info-label">Requerente</span>
                  <span className="info-value">{ticket.user?.name || "—"}</span>
                </div>
                <div>
                  <span className="info-label">E-mail</span>
                  <span className="info-value">{ticket.user?.email || "—"}</span>
                </div>
                <div>
                  <span className="info-label">Telefone</span>
                  <span className="info-value">{ticket.user?.phone || "—"}</span>
                </div>
                <div>
                  <span className="info-label">Data da abertura</span>
                  <span className="info-value">{formatDate(ticket.createdAt)}</span>
                </div>
                <div>
                  <span className="info-label">Última atualização</span>
                  <span className="info-value">{formatDate(ticket.updatedAt)}</span>
                </div>
              </div>

              <h3 className="ticket-card-title">DESCRIÇÃO</h3>
              <p className="ticket-description">{ticket.description}</p>

              {ticket.attachment && (
                <>
                  <h3 className="ticket-card-title">ANEXO</h3>
                  <a
                    href={`${apiBaseUrl}/uploads/${ticket.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ticket-attachment-link"
                  >
                    {ticket.attachment}
                  </a>
                </>
              )}
            </div>

            <div className="ticket-card">
              <h3 className="ticket-card-title">Histórico / Comentários</h3>

              <div className="ticket-comments">
                {ticket.comments?.length === 0 && (
                  <p className="comment-empty">Nenhum comentário ainda.</p>
                )}

                {ticket.comments?.map((comment) => (
                  <div className="comment-item" key={comment.id}>
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.user?.name}
                        <span className={`comment-role ${comment.user?.role === "tech" ? "comment-role-tech" : "comment-role-client"}`}>
                          {comment.user?.role === "tech" ? "Técnico" : "Cliente"}
                        </span>
                      </span>
                      <span className="comment-time">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))}
              </div>

              <div className="comment-input-area">
                <input
                  type="text"
                  className="comment-input"
                  placeholder="Adicionar comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
                />
                <button className="comment-send" onClick={handleSendComment}>
                  Enviar
                </button>
              </div>
            </div>
          </div>

          <div className="ticket-right">
            {user?.role === "tech" && (
              <div className="ticket-card">
                <h3 className="ticket-card-title">ALTERAR STATUS</h3>
                <div className="status-buttons">
                  <button
                    className={`status-btn ${status === "Aberto" ? "active" : ""}`}
                    onClick={() => handleStatusChange("Aberto")}
                  >
                    ● Aberto
                  </button>
                  <button
                    className={`status-btn ${status === "Em andamento" ? "active" : ""}`}
                    onClick={() => handleStatusChange("Em andamento")}
                  >
                    ● Em andamento
                  </button>
                  <button
                    className={`status-btn ${status === "Resolvido" ? "active" : ""}`}
                    onClick={() => handleStatusChange("Resolvido")}
                  >
                    ● Resolvido
                  </button>
                  <button
                    className={`status-btn ${status === "Fechado" ? "active" : ""}`}
                    onClick={() => handleStatusChange("Fechado")}
                  >
                    ○ Fechado
                  </button>
                </div>
              </div>
            )}

            {user?.role === "tech" && (
              <div className="ticket-card">
                <h3 className="ticket-card-title">ALTERAR PRIORIDADE</h3>
                <div className="status-buttons">
                  <button
                    className={`priority-btn ${priority === "Baixa" ? "active-baixa" : ""}`}
                    onClick={() => handlePriorityChange("Baixa")}
                  >
                    ● Baixa
                  </button>
                  <button
                    className={`priority-btn ${priority === "Média" ? "active-media" : ""}`}
                    onClick={() => handlePriorityChange("Média")}
                  >
                    ● Média
                  </button>
                  <button
                    className={`priority-btn ${priority === "Alta" ? "active-alta" : ""}`}
                    onClick={() => handlePriorityChange("Alta")}
                  >
                    ● Alta
                  </button>
                  <button
                    className={`priority-btn ${priority === "Crítica" ? "active-critica" : ""}`}
                    onClick={() => handlePriorityChange("Crítica")}
                  >
                    ● Crítica
                  </button>
                </div>
              </div>
            )}

            <div className="ticket-card">
              <h3 className="ticket-card-title">DETALHES</h3>
              <div className="detail-item">
                <span className="info-label">Categoria</span>
                <span className="info-value">{ticket.category}</span>
              </div>
              <div className="detail-item">
                <span className="info-label">Prioridade</span>
                <span className="info-value priority-alta">{priority}</span>
              </div>
              <div className="detail-item">
                <span className="info-label">Criado em</span>
                <span className="info-value">{formatDate(ticket.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TicketDetail;
