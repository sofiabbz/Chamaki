import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";
import "./Reports.css";

function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/tickets/stats");
        setStats(response.data);
      } catch (err) {
        console.log("Erro ao buscar estatísticas");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="reports-page">
        <Sidebar type="tech" />
        <main className="reports-main">
          <p style={{ color: "#94A3B8" }}>Carregando...</p>
        </main>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="reports-page">
        <Sidebar type="tech" />
        <main className="reports-main">
          <p style={{ color: "#EF4444" }}>Erro ao carregar relatórios.</p>
        </main>
      </div>
    );
  }

  const maxStatus = Math.max(...Object.values(stats.byStatus), 1);
  const maxCategory = Math.max(...Object.values(stats.byCategory || {}), 1);
  const maxPriority = Math.max(...Object.values(stats.byPriority || {}), 1);

  const statusColors = {
    Aberto: "#F59E0B",
    "Em andamento": "#8B5CF6",
    Resolvido: "#10B981",
    Fechado: "#64748B",
  };

  const categoryColors = {
    Hardware: "#992802",
    Software: "#3B82F6",
    Rede: "#F59E0B",
    "Acesso / Permissões": "#10B981",
  };

  const priorityColors = {
    Crítica: "#EF4444",
    Alta: "#F59E0B",
    Média: "#3B82F6",
    Baixa: "#10B981",
  };

  return (
    <div className="reports-page">
      <Sidebar type="tech" />
      <main className="reports-main">
        <h1 className="reports-title">Relatórios</h1>
        <p className="reports-subtitle">Visão geral das estatísticas dos chamados.</p>

        <div className="reports-cards">
          <div className="reports-stat-card">
            <span className="reports-stat-number blue">{stats.total}</span>
            <span className="reports-stat-label">Total de chamados</span>
          </div>
          <div className="reports-stat-card">
            <span className="reports-stat-number yellow">{stats.last7Days}</span>
            <span className="reports-stat-label">Últimos 7 dias</span>
          </div>
          <div className="reports-stat-card">
            <span className="reports-stat-number green">{stats.last30Days}</span>
            <span className="reports-stat-label">Últimos 30 dias</span>
          </div>
          <div className="reports-stat-card">
            <span className="reports-stat-number pink">{stats.avgResolutionHours}h</span>
            <span className="reports-stat-label">Tempo médio de resolução</span>
          </div>
        </div>

        <div className="reports-charts">
          <div className="reports-chart-card">
            <h3 className="reports-chart-title">Por status</h3>
            <div className="chart-bar-group">
              {Object.entries(stats.byStatus).map(([label, count]) => (
                <div className="chart-bar-item" key={label}>
                  <div className="chart-bar-info">
                    <span className="chart-bar-label" style={{ color: statusColors[label] || "#94A3B8" }}>{label}</span>
                    <span className="chart-bar-count">{count}</span>
                  </div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{ width: `${(count / maxStatus) * 100}%`, backgroundColor: statusColors[label] || "#94A3B8" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reports-chart-card">
            <h3 className="reports-chart-title">Por categoria</h3>
            <div className="chart-bar-group">
              {Object.entries(stats.byCategory || {}).map(([label, count]) => (
                <div className="chart-bar-item" key={label}>
                  <div className="chart-bar-info">
                    <span className="chart-bar-label" style={{ color: categoryColors[label] || "#94A3B8" }}>{label}</span>
                    <span className="chart-bar-count">{count}</span>
                  </div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{ width: `${(count / maxCategory) * 100}%`, backgroundColor: categoryColors[label] || "#94A3B8" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reports-chart-card">
            <h3 className="reports-chart-title">Por prioridade</h3>
            <div className="chart-bar-group">
              {Object.entries(stats.byPriority || {}).map(([label, count]) => (
                <div className="chart-bar-item" key={label}>
                  <div className="chart-bar-info">
                    <span className="chart-bar-label" style={{ color: priorityColors[label] || "#94A3B8" }}>{label}</span>
                    <span className="chart-bar-count">{count}</span>
                  </div>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{ width: `${(count / maxPriority) * 100}%`, backgroundColor: priorityColors[label] || "#94A3B8" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="reports-summary">
          <h3 className="reports-chart-title">Resumo</h3>
          <div className="reports-summary-grid">
            <div className="reports-summary-item">
              <span className="reports-summary-label">Chamados abertos nos últimos 7 dias</span>
              <span className="reports-summary-value">{stats.last7Days}</span>
            </div>
            <div className="reports-summary-item">
              <span className="reports-summary-label">Chamados abertos nos últimos 30 dias</span>
              <span className="reports-summary-value">{stats.last30Days}</span>
            </div>
            <div className="reports-summary-item">
              <span className="reports-summary-label">Tempo médio de resolução</span>
              <span className="reports-summary-value">{stats.avgResolutionHours} horas</span>
            </div>
            <div className="reports-summary-item">
              <span className="reports-summary-label">Total de chamados no sistema</span>
              <span className="reports-summary-value">{stats.total}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reports;
