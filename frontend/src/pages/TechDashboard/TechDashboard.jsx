import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";
import "./TechDashboard.css";

function TechDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

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

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, filterCategory, filterPriority]);

  const counters = {
    total: tickets.length,
    andamento: tickets.filter((t) => t.status === "Em andamento").length,
    resolvidos: tickets.filter((t) => t.status === "Resolvido").length,
    abertos: tickets.filter((t) => t.status === "Aberto").length,
    criticos: tickets.filter((t) => t.priority === "Crítica").length,
  };

  const statusData = {
    aberto: tickets.filter((t) => t.status === "Aberto").length,
    andamento: tickets.filter((t) => t.status === "Em andamento").length,
    resolvido: tickets.filter((t) => t.status === "Resolvido").length,
    fechado: tickets.filter((t) => t.status === "Fechado").length,
  };

  const categoryData = {
    hardware: tickets.filter((t) => t.category === "Hardware").length,
    software: tickets.filter((t) => t.category === "Software").length,
    rede: tickets.filter((t) => t.category === "Rede").length,
    acesso: tickets.filter((t) => t.category === "Acesso / Permissões").length,
  };

  const priorityData = {
    critica: tickets.filter((t) => t.priority === "Crítica").length,
    alta: tickets.filter((t) => t.priority === "Alta").length,
    media: tickets.filter((t) => t.priority === "Média").length,
    baixa: tickets.filter((t) => t.priority === "Baixa").length,
  };

  const maxStatus = Math.max(...Object.values(statusData), 1);
  const maxCategory = Math.max(...Object.values(categoryData), 1);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="tech-dashboard">
      <Sidebar type="tech" />

      <main className="tech-main">
        <div className="tech-top">
          <div>
            <h1 className="tech-title">Dashboard</h1>
            <p className="tech-subtitle">Visão geral dos chamados.</p>
          </div>
        </div>

        <div className="tech-counters">
          <div className="tech-counter">
            <span className="tech-counter-number blue">{counters.total}</span>
            <span className="tech-counter-label">Total</span>
          </div>
          <div className="tech-counter">
            <span className="tech-counter-number pink">{counters.andamento}</span>
            <span className="tech-counter-label">Em andamento</span>
          </div>
          <div className="tech-counter">
            <span className="tech-counter-number green">{counters.resolvidos}</span>
            <span className="tech-counter-label">Resolvidos</span>
          </div>
          <div className="tech-counter">
            <span className="tech-counter-number yellow">{counters.abertos}</span>
            <span className="tech-counter-label">Abertos</span>
          </div>
          <div className="tech-counter">
            <span className="tech-counter-number red">{counters.criticos}</span>
            <span className="tech-counter-label">Críticos</span>
          </div>
        </div>

        <div className="tech-charts">
          <div className="tech-chart-card">
            <h3 className="tech-chart-title">Por status</h3>
            <div className="chart-bar-group">
              <div className="chart-bar-item">
                <span className="chart-bar-label yellow">Aberto</span>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${(statusData.aberto / maxStatus) * 100}%`, backgroundColor: "#F59E0B" }}></div>
                </div>
              </div>
              <div className="chart-bar-item">
                <span className="chart-bar-label purple">Em andamento</span>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${(statusData.andamento / maxStatus) * 100}%`, backgroundColor: "#8B5CF6" }}></div>
                </div>
              </div>
              <div className="chart-bar-item">
                <span className="chart-bar-label green">Resolvidos</span>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${(statusData.resolvido / maxStatus) * 100}%`, backgroundColor: "#10B981" }}></div>
                </div>
              </div>
              <div className="chart-bar-item">
                <span className="chart-bar-label gray">Fechado</span>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${(statusData.fechado / maxStatus) * 100}%`, backgroundColor: "#64748B" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="tech-chart-card">
            <h3 className="tech-chart-title">Por categoria</h3>
            <div className="chart-bar-group">
              <div className="chart-bar-item">
                <span className="chart-bar-label red">Hardware</span>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${(categoryData.hardware / maxCategory) * 100}%`, backgroundColor: "#992802" }}></div>
                </div>
              </div>
              <div className="chart-bar-item">
                <span className="chart-bar-label blue">Software</span>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${(categoryData.software / maxCategory) * 100}%`, backgroundColor: "#3B82F6" }}></div>
                </div>
              </div>
              <div className="chart-bar-item">
                <span className="chart-bar-label yellow">Rede</span>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${(categoryData.rede / maxCategory) * 100}%`, backgroundColor: "#F59E0B" }}></div>
                </div>
              </div>
              <div className="chart-bar-item">
                <span className="chart-bar-label green">Acesso</span>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width: `${(categoryData.acesso / maxCategory) * 100}%`, backgroundColor: "#10B981" }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="tech-chart-card">
            <h3 className="tech-chart-title">Por prioridade</h3>
            <div className="chart-circles">
              <div className="chart-circle-item">
                <div className="chart-circle red-border">
                  <span>{priorityData.critica}</span>
                </div>
                <span className="chart-circle-label">Crítica</span>
              </div>
              <div className="chart-circle-item">
                <div className="chart-circle yellow-border">
                  <span>{priorityData.alta}</span>
                </div>
                <span className="chart-circle-label">Alta</span>
              </div>
              <div className="chart-circle-item">
                <div className="chart-circle blue-border">
                  <span>{priorityData.media}</span>
                </div>
                <span className="chart-circle-label">Média</span>
              </div>
              <div className="chart-circle-item">
                <div className="chart-circle green-border">
                  <span>{priorityData.baixa}</span>
                </div>
                <span className="chart-circle-label">Baixa</span>
              </div>
            </div>
          </div>
        </div>

        <div className="tech-table-container">
          <h3 className="tech-table-title">CHAMADOS RECENTES</h3>

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

          <div className="tech-table">
            <div className="tech-table-header">
              <span>ID</span>
              <span>Título</span>
              <span>Requerente</span>
              <span>Categoria</span>
              <span>Status</span>
              <span>Data</span>
              <span>Prioridade</span>
            </div>

            {paginated.length === 0 && (
              <p className="table-empty">Nenhum chamado encontrado.</p>
            )}

            {paginated.map((ticket) => (
              <div
                className="tech-table-row"
                key={ticket.id}
                onClick={() => navigate(`/chamado/${ticket.id}`)}
              >
                <span className="table-id">#{String(ticket.id).padStart(3, "0")}</span>
                <span>{ticket.title}</span>
                <span>{ticket.user?.name || "—"}</span>
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

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Anterior
              </button>
              <span className="pagination-info">
                Página {page} de {totalPages}
              </span>
              <button
                className="pagination-btn"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default TechDashboard;
