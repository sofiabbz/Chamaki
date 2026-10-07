import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";
import "./ClientDashboard.css";

function ClientDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get("/tickets");
        setTickets(response.data);
      } catch (err) {
        console.log("Erro ao buscar chamados");
      }
    };

    fetchTickets();
  }, []);

  const filtered = tickets.filter((t) => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterCategory && t.category !== filterCategory) return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    return true;
  });

  const counters = {
    abertos: tickets.filter((t) => t.status === "Aberto").length,
    andamento: tickets.filter((t) => t.status === "Em andamento").length,
    resolvidos: tickets.filter((t) => t.status === "Resolvido").length,
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="client-dashboard">
      <Sidebar type="client" />

      <main className="client-main">
        <div className="client-top">
          <div>
            <h1 className="client-title">Meus Chamados</h1>
            <p className="client-subtitle">Acompanhe o status dos seus pedidos.</p>
          </div>
          <button
            className="client-new-btn"
            onClick={() => navigate("/novo-chamado")}
          >
            + Novo Chamado
          </button>
        </div>

        <div className="client-welcome">
          <div className="client-welcome-text">
            <h2 className="client-welcome-name">Olá, {user?.name?.split(" ")[0]}!</h2>
            <p className="client-welcome-summary">
              Você tem <strong>{counters.abertos}</strong> chamado{counters.abertos !== 1 ? "s" : ""} em aberto
              {counters.andamento > 0 && <> e <strong>{counters.andamento}</strong> em andamento</>}.
            </p>
          </div>
        </div>

        <div className="client-counters">
          <div className="counter-card">
            <span className="counter-number green">{counters.abertos}</span>
            <span className="counter-label">Abertos</span>
          </div>
          <div className="counter-card">
            <span className="counter-number yellow">{counters.andamento}</span>
            <span className="counter-label">Em andamento</span>
          </div>
          <div className="counter-card">
            <span className="counter-number red">{counters.resolvidos}</span>
            <span className="counter-label">Resolvidos</span>
          </div>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            className="filter-input"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Todos os status</option>
            <option value="Aberto">Aberto</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Resolvido">Resolvido</option>
            <option value="Fechado">Fechado</option>
          </select>
          <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">Todas as categorias</option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Rede">Rede</option>
            <option value="Acesso / Permissões">Acesso / Permissões</option>
          </select>
          <select className="filter-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="">Todas as prioridades</option>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
            <option value="Crítica">Crítica</option>
          </select>
        </div>

        <div className="client-table">
          <div className="table-header">
            <span>ID</span>
            <span>Título</span>
            <span>Categoria</span>
            <span>Status</span>
            <span>Data</span>
            <span>Prioridade</span>
          </div>

          {filtered.length === 0 && (
            <p className="table-empty">Nenhum chamado encontrado.</p>
          )}

          {filtered.map((ticket) => (
            <div
              className="table-row"
              key={ticket.id}
              onClick={() => navigate(`/chamado/${ticket.id}`)}
            >
              <span className="table-id">#{String(ticket.id).padStart(3, "0")}</span>
              <span>{ticket.title}</span>
              <span>{ticket.category}</span>
              <span>
                <span className={`badge badge-${ticket.status.toLowerCase().replace(" ", "-")}`}>
                  {ticket.status}
                </span>
              </span>
              <span>{formatDate(ticket.createdAt)}</span>
              <span>{ticket.priority}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ClientDashboard;
