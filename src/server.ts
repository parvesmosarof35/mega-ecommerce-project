import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

import httpStatus from "http-status";
import AppError from "./app/errors/AppError";



let server: Server | null = null;


type channelName = string;
const channelClients = new Map<channelName, Set<WebSocket>>();

function safeSend(ws: WebSocket, data: unknown) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

function broadcastToChannel(
  channelName: channelName,
  data: unknown,
  excludeSocket: WebSocket | null = null
) {
  const clients = channelClients.get(channelName);
  if (!clients) return;
  for (const client of clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    if (excludeSocket && client === excludeSocket) continue;
    safeSend(client, data);
  }
}

// Heartbeat helper to detect dead connections


export default app;

async function main() {
  try {
    await mongoose.connect(config.database_url as string, { family: 4 });
    console.log("database connected successfully");

    if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
      server = app.listen(config.port, () => {
        console.log(` app listening http://${config.host}:${config.port}`);
      });
    }

    process.on("unhandledRejection", () => {
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

    process.on("uncaughtException", () => {
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received");
      if (server) {
        server.close(() => {
          console.log("Server closed due to SIGTERM");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });

    process.on("SIGINT", () => {
      console.log("SIGINT received");
      if (server) {
        server.close(() => {
          console.log("Server closed due to SIGINT");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
  } catch (err: any) {
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      "server unavailable",
      err
    );
  }
}

main().then(() => {
  console.log("-- ecommerce server is running---");
});
