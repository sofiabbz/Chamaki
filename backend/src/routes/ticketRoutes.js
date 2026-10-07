const express = require("express");
const prisma = require("../lib/prisma");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(authMiddleware);

router.post("/", upload.single("attachment"), async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category || !priority) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });
    }

    const data = { title, description, category, priority, userId: req.user.id };
    if (req.file) {
      data.attachment = req.file.filename;
    }

    const ticket = await prisma.ticket.create({ data });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar chamado" });
  }
});

router.get("/stats", async (req, res) => {
  if (req.user.role !== "tech") {
    return res.status(403).json({ error: "Acesso restrito a técnicos" });
  }

  try {
    const tickets = await prisma.ticket.findMany();

    const total = tickets.length;

    const byStatus = {
      Aberto: 0,
      "Em andamento": 0,
      Resolvido: 0,
      Fechado: 0,
    };
    const byCategory = {};
    const byPriority = {};

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    let last7Days = 0;
    let last30Days = 0;

    const resolvedTimes = [];

    for (const ticket of tickets) {
      byStatus[ticket.status] = (byStatus[ticket.status] || 0) + 1;
      byCategory[ticket.category] = (byCategory[ticket.category] || 0) + 1;
      byPriority[ticket.priority] = (byPriority[ticket.priority] || 0) + 1;

      if (new Date(ticket.createdAt) >= sevenDaysAgo) last7Days++;
      if (new Date(ticket.createdAt) >= thirtyDaysAgo) last30Days++;

      if (ticket.status === "Resolvido" || ticket.status === "Fechado") {
        const diff = new Date(ticket.updatedAt) - new Date(ticket.createdAt);
        resolvedTimes.push(diff);
      }
    }

    const avgResolutionMs = resolvedTimes.length > 0
      ? resolvedTimes.reduce((a, b) => a + b, 0) / resolvedTimes.length
      : 0;

    const avgResolutionHours = Math.round(avgResolutionMs / (1000 * 60 * 60) * 10) / 10;

    res.json({
      total,
      byStatus,
      byCategory,
      byPriority,
      last7Days,
      last30Days,
      avgResolutionHours,
    });
  } catch (error) {
    res.status(400).json({ error: "Erro ao buscar estatísticas" });
  }
});

router.get("/", async (req, res) => {
  try {
    const where = req.user.role === "client" ? { userId: req.user.id } : {};

    const tickets = await prisma.ticket.findMany({
      where,
      include: { user: true, comments: true },
      orderBy: { createdAt: "desc" },
    });

    res.json(tickets);
  } catch (error) {
    res.status(400).json({ error: "Erro ao listar chamados" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: true,
        comments: { include: { user: true } },
      },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Chamado não encontrado" });
    }

    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: "Erro ao buscar chamado" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status, priority } = req.body;

    const data = {};
    if (status) data.status = status;
    if (priority) data.priority = priority;

    const ticket = await prisma.ticket.update({
      where: { id: parseInt(req.params.id) },
      data,
    });

    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: "Erro ao atualizar chamado" });
  }
});

router.post("/:id/comments", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Texto do comentário é obrigatório" });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        userId: req.user.id,
        ticketId: parseInt(req.params.id),
      },
      include: { user: true },
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: "Erro ao adicionar comentário" });
  }
});

module.exports = router;
