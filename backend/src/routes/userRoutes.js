const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/cadastro", async (req, res) => {
  try {
    const { name, email, cpf, phone, password, role, techKey } = req.body;

    if (!name || !email || !cpf || !password) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "E-mail inválido" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "A senha deve ter pelo menos 8 caracteres" });
    }

    if (role === "tech") {
      if (!techKey || techKey !== process.env.TECH_ACCESS_KEY) {
        return res.status(403).json({ error: "Chave de acesso inválida para cadastro de técnico" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, cpf, phone, password: hashedPassword, role: role || "client" },
    });

    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "E-mail ou CPF já cadastrado" });
    }
    console.error("Erro no cadastro:", error);
    res.status(400).json({ error: "Erro ao cadastrar usuário" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Preencha e-mail e senha" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, cpf: user.cpf, phone: user.phone },
    });
  } catch (error) {
    res.status(400).json({ error: "Erro ao fazer login" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, phone } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { name, phone },
    });

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone });
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar perfil" });
  }
});

module.exports = router;
