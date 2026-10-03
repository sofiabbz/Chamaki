import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import estrela from "../../assets/estrela.png";
import PasswordStrength from "../../components/PasswordStrength/PasswordStrength";
import Toast from "../../components/Toast/Toast";
import api from "../../services/api";
import "./Register.css";
import { maskCPF, maskPhone } from "../../utils/masks";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "client",
    techKey: "",
  });

  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "cpf") value = maskCPF(value);
    if (name === "phone") value = maskPhone(value);

    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "A senha deve ter pelo menos 8 caracteres";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "A senha deve ter pelo menos um caractere especial (!@#$%...)";
    }
    return null;
  };

  const handleSubmit = async () => {
    setError("");

    if (!formData.name || !formData.email || !formData.cpf || !formData.password) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    if (formData.role === "tech" && !formData.techKey) {
      setError("Informe a chave de acesso para cadastro de técnico!");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === "tech") {
        payload.techKey = formData.techKey;
      }

      await api.post("/users/cadastro", payload);

      setToast({ message: "Sucesso! Conta criada com sucesso.", type: "success" });

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao cadastrar. E-mail ou CPF já cadastrado.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <img src={estrela} alt="" className="register-star" />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        <h2 className="register-title">Área de Cadastro</h2>
        <div className="register-divider"></div>

        {error && <p className="register-error">{error}</p>}

        <div className="register-grid">
          <div>
            <label className="register-label">Nome Completo *</label>
            <input
              type="text"
              name="name"
              className="register-input"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="register-label">CPF *</label>
            <input
              type="text"
              name="cpf"
              className="register-input"
              value={formData.cpf}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="register-label">E-mail *</label>
            <input
              type="email"
              name="email"
              className="register-input"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="register-label">Senha *</label>
            <input
              type="password"
              name="password"
              className="register-input"
              value={formData.password}
              onChange={handleChange}
            />
            <PasswordStrength password={formData.password} />
          </div>

          <div>
            <label className="register-label">Telefone</label>
            <input
              type="text"
              name="phone"
              className="register-input"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="register-label">Confirmar Senha *</label>
            <input
              type="password"
              name="confirmPassword"
              className="register-input"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="register-label">Tipo de conta *</label>
            <select
              name="role"
              className="register-input"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="client">Cliente</option>
              <option value="tech">Técnico</option>
            </select>
          </div>

          {formData.role === "tech" && (
            <div>
              <label className="register-label">Chave de Acesso (Técnico) *</label>
              <input
                type="password"
                name="techKey"
                className="register-input"
                placeholder="Informe a chave fornecida pela empresa"
                value={formData.techKey}
                onChange={handleChange}
              />
            </div>
          )}
        </div>

        <button className="register-btn" onClick={handleSubmit}>
          Criar Conta
        </button>

        <p className="register-login">
          Já possui uma conta?{" "}
          <Link to="/login" className="register-login-link">
            Entre aqui!
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
