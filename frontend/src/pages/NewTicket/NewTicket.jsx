import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Toast from "../../components/Toast/Toast";
import api from "../../services/api";
import "./NewTicket.css";

const SUBJECTS = [
  "Instalação de software",
  "Atualização de software",
  "Equipamento defeituoso",
  "Computador não liga",
  "Computador lento",
  "Problema com impressora",
  "Problema de rede / internet",
  "Acesso a sistema / permissões",
  "Configuração de e-mail",
  "Recuperação de dados",
  "Troca de equipamento",
  "Outro",
];

const SUBJECT_PRIORITY = {
  "Computador não liga": "Crítica",
  "Equipamento defeituoso": "Crítica",
  "Problema de rede / internet": "Alta",
  "Acesso a sistema / permissões": "Alta",
  "Recuperação de dados": "Alta",
  "Computador lento": "Média",
  "Problema com impressora": "Média",
  "Troca de equipamento": "Média",
  "Instalação de software": "Baixa",
  "Atualização de software": "Baixa",
  "Configuração de e-mail": "Baixa",
  "Outro": "Média",
};

const SUBJECT_CATEGORY = {
  "Instalação de software": "Software",
  "Atualização de software": "Software",
  "Equipamento defeituoso": "Hardware",
  "Computador não liga": "Hardware",
  "Computador lento": "Hardware",
  "Problema com impressora": "Hardware",
  "Problema de rede / internet": "Rede",
  "Acesso a sistema / permissões": "Acesso / Permissões",
  "Configuração de e-mail": "Software",
  "Recuperação de dados": "Software",
  "Troca de equipamento": "Hardware",
};

function NewTicket() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const isTech = user?.role === "tech";

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [customTitle, setCustomTitle] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "title") {
      const autoCategory = SUBJECT_CATEGORY[value] || "";
      setFormData({ ...formData, title: value, category: autoCategory });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
    if (!allowedTypes.includes(selected.type)) {
      setError("Tipo de arquivo não permitido. Use PNG, JPG ou PDF.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("Arquivo muito grande. Máximo 5MB.");
      return;
    }

    setFile(selected);
    setError("");
  };

  const handleSubmit = async () => {
    const finalTitle = formData.title === "Outro" ? customTitle : formData.title;

    if (!finalTitle || !formData.category || !formData.description) {
      setError("Preencha todos os campos obrigatórios!");
      return;
    }

    if (formData.title === "Outro" && !customTitle.trim()) {
      setError("Descreva o assunto do chamado!");
      return;
    }

    if (isTech && !formData.priority) {
      setError("Selecione a prioridade!");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", finalTitle);
      data.append("category", formData.category);
      data.append("priority", isTech ? formData.priority : (SUBJECT_PRIORITY[formData.title] || "Média"));
      data.append("description", formData.description);
      if (file) {
        data.append("attachment", file);
      }

      await api.post("/tickets", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToast({ message: "Chamado criado com sucesso!", type: "success" });

      setTimeout(() => {
        navigate(isTech ? "/dashboard-tecnico" : "/dashboard");
      }, 2000);
    } catch (err) {
      setToast({ message: "Erro ao criar chamado.", type: "error" });
    }
  };

  return (
    <div className="new-ticket">
      <Sidebar type={isTech ? "tech" : "client"} />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <main className="new-ticket-main">
        <h1 className="new-ticket-title">Assunto do chamado</h1>
        <select
          name="title"
          className="new-ticket-select"
          value={formData.title}
          onChange={handleChange}
        >
          <option value="">Selecione o assunto</option>
          {SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>

        {formData.title === "Outro" && (
          <>
            <label className="new-ticket-label">Descreva o assunto</label>
            <input
              type="text"
              className="new-ticket-input"
              placeholder="Ex: Problema com projetor da sala de reuniões"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
            />
          </>
        )}

        <div className="new-ticket-grid">
          <div>
            <label className="new-ticket-label">Categoria</label>
            <select
              name="category"
              className="new-ticket-select"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Selecione a categoria</option>
              <option value="Hardware">Hardware</option>
              <option value="Software">Software</option>
              <option value="Rede">Rede</option>
              <option value="Acesso / Permissões">Acesso / Permissões</option>
            </select>
          </div>

          {isTech && (
            <div>
              <label className="new-ticket-label">Prioridade</label>
              <select
                name="priority"
                className="new-ticket-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="">Selecione a prioridade</option>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>
          )}
        </div>

        <label className="new-ticket-label">Descrição do problema</label>
        <textarea
          name="description"
          className="new-ticket-textarea"
          placeholder="Descreva o problema com o máximo de detalhes: o que aconteceu, quando começou, mensagens de erro que apareceram..."
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <label className="new-ticket-label">Anexo (opcional)</label>
        <div
          className="new-ticket-upload"
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileChange}
          />
          {file ? (
            <p className="upload-file-name">{file.name}</p>
          ) : (
            <>
              <p>Arraste um arquivo ou <span className="upload-link">clique aqui</span></p>
              <span className="upload-hint">PNG, JPG ou PDF até 5MB</span>
            </>
          )}
        </div>

        {error && <p className="new-ticket-error">{error}</p>}

        <div className="new-ticket-buttons">
          <button className="btn-cancel" onClick={() => navigate(-1)}>Cancelar</button>
          <button className="btn-submit" onClick={handleSubmit}>Enviar chamado</button>
        </div>
      </main>
    </div>
  );
}

export default NewTicket;
