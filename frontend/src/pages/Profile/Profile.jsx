import { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Toast from "../../components/Toast/Toast";
import api from "../../services/api";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        cpf: user.cpf || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put(`/users/${user.id}`, {
        name: formData.name,
        phone: formData.phone,
      });

      const updatedUser = { ...user, name: formData.name, phone: formData.phone };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setToast({ message: "Perfil atualizado com sucesso!", type: "success" });
    } catch (err) {
      setToast({ message: "Erro ao atualizar perfil.", type: "error" });
    }
  };

  return (
    <div className="profile-page">
      <Sidebar type={user?.role === "tech" ? "tech" : "client"} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="profile-main">
        <h1 className="profile-title">Meu Perfil</h1>
        <p className="profile-subtitle">Gerencie suas informações pessoais</p>

        <div className="profile-card">
          <div className="profile-avatar">
            {formData.name.charAt(0).toUpperCase()}
          </div>

          <div className="profile-grid">
            <div>
              <label className="profile-label">Nome Completo</label>
              <input
                type="text"
                name="name"
                className="profile-input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="profile-label">E-mail</label>
              <input
                type="email"
                className="profile-input profile-input-disabled"
                value={formData.email}
                disabled
              />
            </div>

            <div>
              <label className="profile-label">CPF</label>
              <input
                type="text"
                className="profile-input profile-input-disabled"
                value={formData.cpf}
                disabled
              />
            </div>

            <div>
              <label className="profile-label">Telefone</label>
              <input
                type="text"
                name="phone"
                className="profile-input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="profile-label">Tipo de conta</label>
              <input
                type="text"
                className="profile-input profile-input-disabled"
                value={user?.role === "tech" ? "Técnico" : "Cliente"}
                disabled
              />
            </div>
          </div>

          <button className="profile-btn" onClick={handleSave}>
            Salvar alterações
          </button>
        </div>
      </main>
    </div>
  );
}

export default Profile;
