import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo-chamaki.png";
import estrela from "../../assets/estrela.png";
import api from "../../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRemember(true);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError("");

    if (!formData.email || !formData.password) {
      setError("Preencha e-mail e senha!");
      return;
    }

    try {
      const response = await api.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (remember) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      if (user.role === "tech") {
        navigate("/dashboard-tecnico");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Email ou senha incorretos!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="login-brand-top">
          <img src={logo} alt="Chamaki" className="login-logo" />
        </div>

        <img src={estrela} alt="" className="login-star" />

        <p className="login-brand-phrase">
          Precisa de um suporte no seu computador? Nós podemos te ajudar
          com isso!
        </p>
      </div>

      <div className="login-form-container">
        <h2 className="login-title">Área de Login</h2>
        <div className="login-divider"></div>

        {error && <p className="login-error">{error}</p>}

        <label className="login-label">Nome de usuário ou e-mail</label>
        <input
          type="text"
          name="email"
          className="login-input"
          value={formData.email}
          onChange={handleChange}
        />

        <label className="login-label">Senha</label>
        <input
          type="password"
          name="password"
          className="login-input"
          value={formData.password}
          onChange={handleChange}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <div className="login-options">
          <label className="login-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Lembrar de mim
          </label>
          <span className="login-forgot-disabled">Esqueceu sua senha? (Em breve)</span>
        </div>

        <button className="login-btn" onClick={handleLogin}>Entrar</button>

        <p className="login-register">
          Ainda não possui uma conta?{" "}
          <Link to="/cadastro" className="login-register-link">
            Registre-se aqui!
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
