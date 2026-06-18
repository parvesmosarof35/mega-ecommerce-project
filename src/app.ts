import cors from "cors";
import express from "express";
import os from "os";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import bodyParser from "body-parser";
// import cron from "node-cron";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import path from "path";
import config from "./app/config";
import router from "./app/routes";
import PaymentController from "./app/modules/payment/payment.controller";
import notFound from "./app/middlewares/notFound";
import globalErrorHandelar from "./app/middlewares/globalErrorHandler";
import AppError from "./app/errors/AppError";
import status from "http-status";
import superAdmin from "./app/utils/superAdmin";
import httpStatus from "http-status";
import auto_delete_unverifyed_user from "./app/utils/auto_delete_unverifyed_user";

declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}

const app = express();

// Set up rate limiter for all API routes
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,  // 5 minutes
  max: 100,  // Limit each IP to 100 requests per `windowMs` 
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cookieParser());

app.post(
  "/api/v1/webhook-verify",
  express.raw({ type: "application/json" }),
  PaymentController.webhookHandler,
);

app.use(
  bodyParser.json({
    verify: function (
      req: express.Request,
      res: express.Response,
      buf: Buffer
    ) {
      req.rawBody = buf;
    },
  })
);

app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(
  config.file_path as string,
  express.static(path.join(__dirname, "public"))
);

app.use(cors({
  origin: [
    "https://lunel-beauty.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173",
    "https://dewmii.vercel.app",
    "https://dewmii.com",
    `${config.FRONTEND_URL}`,
    /\.vercel\.app$/ // Allow all Vercel subdomains
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
superAdmin();

cron.schedule("0 0 * * *", async () => {
  try {
    await superAdmin();
  } catch (error: any) {
    throw new AppError(
      status.BAD_REQUEST,
      "Issue occurred during automatic super admin creation in cron job.",
      error.message
    );
  }
});


// auto_delete_unverifyed_user
cron.schedule("*/30 * * * *", async () => {
  try {
    await auto_delete_unverifyed_user();
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Issues in the notification cron job (every 30 minutes)",
      error
    );
  }
});

// Server status helper
const getSystemStatus = () => {
  const systemUptime = os.uptime();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  return {
    status: "OPERATIONAL",
    time: new Date().toLocaleString(),
    uptime: {
      seconds: systemUptime,
      hours: Math.floor(systemUptime / 3600),
      minutes: Math.floor((systemUptime % 3600) / 60),
      secondsLeft: Math.floor(systemUptime % 60),
    },
    cpu: {
      load: (os.loadavg()[0] || 0).toFixed(2),
      model: os.cpus()[0].model,
      cores: os.cpus().length,
    },
    memory: {
      total: (totalMem / (1024 * 1024 * 1024)).toFixed(2),
      used: (usedMem / (1024 * 1024 * 1024)).toFixed(2),
      free: (freeMem / (1024 * 1024 * 1024)).toFixed(2),
      percent: ((usedMem / totalMem) * 100).toFixed(2),
    },
    database: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED",
    nodeVersion: process.version,
    platform: os.platform(),
    arch: os.arch(),
  };
};

app.get("/api/v1/server-status", (_req, res) => {
  res.json(getSystemStatus());
});

app.get("/", (_req, res) => {
  const status = getSystemStatus();
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mega Ecommerce Server Status</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #fb7185;
            --primary-dark: #e11d48;
            --bg: #020617;
            --card-bg: rgba(15, 23, 42, 0.8);
            --border: rgba(251, 113, 133, 0.2);
            --text: #f8fafc;
            --text-muted: #94a3b8;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Outfit', sans-serif;
        }

        body {
            background-color: var(--bg);
            background-image: 
                radial-gradient(circle at 0% 0%, rgba(251, 113, 133, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 100% 100%, rgba(251, 113, 133, 0.1) 0%, transparent 50%);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }

        .container {
            width: 100%;
            max-width: 900px;
            animation: fadeIn 0.8s ease-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        header {
            text-align: center;
            margin-bottom: 40px;
        }

        .logo-container {
            font-size: 3rem;
            margin-bottom: 10px;
            filter: drop-shadow(0 0 20px rgba(251, 113, 133, 0.4));
        }

        h1 {
            font-weight: 600;
            letter-spacing: -0.02em;
            background: linear-gradient(to right, #fff, var(--primary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(34, 197, 94, 0.1);
            color: #4ade80;
            padding: 6px 16px;
            border-radius: 100px;
            font-size: 0.875rem;
            font-weight: 600;
            border: 1px solid rgba(34, 197, 94, 0.2);
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.1);
        }

        .pulse {
            width: 8px;
            height: 8px;
            background: #4ade80;
            border-radius: 50%;
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
            100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
        }

        .card {
            background: var(--card-bg);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 24px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .card:hover {
            border-color: var(--primary);
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(251, 113, 133, 0.1);
        }

        .card h3 {
            color: var(--text-muted);
            font-size: 0.875rem;
            font-weight: 400;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .card .value {
            font-size: 1.5rem;
            font-weight: 600;
            color: #fff;
        }

        .progress-container {
            height: 6px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 100px;
            margin-top: 15px;
            overflow: hidden;
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(to right, var(--primary), var(--primary-dark));
            border-radius: 100px;
            transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .info-grid {
            margin-top: 40px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .info-label {
            font-size: 0.75rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .info-value {
            font-size: 0.9rem;
            color: var(--text);
            font-weight: 500;
        }

        footer {
            text-align: center;
            margin-top: 40px;
            color: var(--text-muted);
            font-size: 0.8rem;
        }

        @media (max-width: 640px) {
            .grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="logo-container">🐺</div>
            <h1>MEGA ECOMMERCE SERVER</h1>
            <div class="status-badge">
                <div class="pulse"></div>
                SYSTEM STATUS MONITOR :: ONLINE
            </div>
        </header>

        <div class="grid">
            <div class="card">
                <h3>⏰ SYSTEM TIME</h3>
                <div class="value" id="time">${status.time}</div>
            </div>
            <div class="card">
                <h3>🔄 UPTIME</h3>
                <div class="value" id="uptime">${status.uptime.hours}h ${status.uptime.minutes}m ${status.uptime.secondsLeft}s</div>
            </div>
            <div class="card">
                <h3>🖥️ CPU LOAD</h3>
                <div class="value" id="cpu-load">${status.cpu.load}%</div>
                <div class="progress-container">
                    <div class="progress-bar" id="cpu-progress" style="width: ${status.cpu.load}%"></div>
                </div>
            </div>
            <div class="card">
                <h3>💾 MEMORY USAGE</h3>
                <div class="value"><span id="mem-used">${status.memory.used}</span> / <span id="mem-total">${status.memory.total}</span> GB</div>
                <div class="progress-container">
                    <div class="progress-bar" id="mem-progress" style="width: ${status.memory.percent}%"></div>
                </div>
            </div>
        </div>

        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">🗄️ Database</span>
                <span class="info-value" id="db-status">${status.database}</span>
            </div>
            <div class="info-item">
                <span class="info-label">🌐 Node Version</span>
                <span class="info-value">${status.nodeVersion}</span>
            </div>
            <div class="info-item">
                <span class="info-label">💻 Platform</span>
                <span class="info-value">${status.platform} (${status.arch})</span>
            </div>
            <div class="info-item">
                <span class="info-label">🚀 Server Status</span>
                <span class="info-value">OPERATIONAL</span>
            </div>
        </div>

        <footer>
            &copy; ${new Date().getFullYear()} Mega Ecommerce Infrastructure • Real-time Monitoring Active
        </footer>
    </div>

    <script>
        async function updateStats() {
            try {
                const response = await fetch('/api/v1/server-status');
                const data = await response.json();
                
                document.getElementById('time').textContent = data.time;
                document.getElementById('uptime').textContent = \`\${data.uptime.hours}h \${data.uptime.minutes}m \${data.uptime.secondsLeft}s\`;
                document.getElementById('cpu-load').textContent = data.cpu.load + '%';
                document.getElementById('cpu-progress').style.width = data.cpu.load + '%';
                document.getElementById('mem-used').textContent = data.memory.used;
                document.getElementById('mem-total').textContent = data.memory.total;
                document.getElementById('mem-progress').style.width = data.memory.percent + '%';
                document.getElementById('db-status').textContent = data.database;
                
                const dbStatus = document.getElementById('db-status');
                if (data.database === 'CONNECTED') {
                    dbStatus.style.color = '#4ade80';
                } else {
                    dbStatus.style.color = '#f87171';
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            }
        }

        setInterval(updateStats, 2000);
    </script>
</body>
</html>
  `;

  res.send(html);
});

// Apply rate limiter to all API routes
app.use("/api/v1", limiter);

app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorHandelar);

export default app;
