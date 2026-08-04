import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createMcpServer } from './mcpServer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with'],
  credentials: true
}));

app.use(express.json());

const mcpServer = createMcpServer();
const activeTransports = new Map();

app.get('/mcp/sse', async (req, res) => {
  console.log('Yangi MCP SSE ulanishi qabul qilindi...');

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const transport = new SSEServerTransport('/mcp/messages', res);
  activeTransports.set(transport.sessionId, transport);

  req.on('close', () => {
    console.log(`SSE Seans yopildi: ${transport.sessionId}`);
    activeTransports.delete(transport.sessionId);
  });

  try {
    await mcpServer.connect(transport);
  } catch (err) {
    console.error("MCP Server ulanishida xatolik:", err);
    activeTransports.delete(transport.sessionId);
  }
});

app.post('/mcp/messages', async (req, res) => {
  const sessionId = req.query.sessionId;

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId parametri ko'rsatilmadi" });
  }

  const transport = activeTransports.get(sessionId);
  if (!transport) {
    return res.status(404).json({ error: "Aktiv SSE seansi topilmadi yoki yopilgan" });
  }

  try {
    await transport.handlePostMessage(req, res);
  } catch (error) {
    console.error("Post Message ishlovida xatolik:", error);
    res.status(500).json({ error: "Xabarni qayta ishlashda xatolik yuz berdi" });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', mcp: 'running' });
});

app.listen(PORT, () => {
  console.log(`🚀 AvtoTest UZ MCP Server http://localhost:${PORT} da ishga tushdi`);
  console.log(`📡 SSE Endpoint: http://localhost:${PORT}/mcp/sse`);
});
