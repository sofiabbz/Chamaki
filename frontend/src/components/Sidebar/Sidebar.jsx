import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  MdDashboard,
  MdAdd,
  MdPerson,
  MdBarChart,
  MdSettings,
  MdLogout,
  MdList,
  MdMenu,
  MdClose,
} from "react-icons/md";
import logo from "../../assets/logo-chamaki.png";
import logoTec from "../../assets/logo-tec.png";
import "./Sidebar.css";

function Sidebar({ type }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button className="sidebar-hamburger" onClick={() => setMobileOpen(true)}>
        <MdMenu />
      </button>

      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}></div>
      )}

      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <img
            src={type === "tech" ? logoTec : logo}
            alt="Chamaki"
            className="sidebar-logo-img"
          />
          <button className="sidebar-close" onClick={() => setMobileOpen(false)}>
            <MdClose />
          </button>
        </div>

        {user && (
          <div className="sidebar-user">
            <span className="sidebar-user-name">
              Olá, {user.name.split(" ")[0]}
            </span>
          </div>
        )}

        <nav className="sidebar-menu">
          {type === "tech" ? (
            <>
              <Link to="/dashboard-tecnico" className={`sidebar-item ${isActive("/dashboard-tecnico") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                <MdDashboard className="sidebar-icon" /> Dashboard
              </Link>
              <Link to="/novo-chamado" className={`sidebar-item ${isActive("/novo-chamado") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                <MdAdd className="sidebar-icon" /> Novo Chamado
              </Link>
              <Link to="/relatorios" className={`sidebar-item ${isActive("/relatorios") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                <MdBarChart className="sidebar-icon" /> Relatórios
              </Link>
              <Link to="/configuracoes" className={`sidebar-item ${isActive("/configuracoes") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                <MdSettings className="sidebar-icon" /> Configurações
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={`sidebar-item ${isActive("/dashboard") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                <MdList className="sidebar-icon" /> Meus Chamados
              </Link>
              <Link to="/novo-chamado" className={`sidebar-item ${isActive("/novo-chamado") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                <MdAdd className="sidebar-icon" /> Novo Chamado
              </Link>
              <Link to="/perfil" className={`sidebar-item ${isActive("/perfil") ? "active" : ""}`} onClick={() => setMobileOpen(false)}>
                <MdPerson className="sidebar-icon" /> Meu Perfil
              </Link>
            </>
          )}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <MdLogout className="sidebar-icon" /> Sair
        </button>
      </aside>
    </>
  );
}

export default Sidebar;
