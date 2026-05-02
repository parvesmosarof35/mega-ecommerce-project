import cors from "cors";
import express from "express";
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
    `${config.FRONTEND_URL}`
  ],
  credentials: true,
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

// delete expaire subscription auto delete
app.get("/", (_req, res) => {
  res.send({
    status: true,
    message: "Welcome to ecommerce of raphm18 ",
  });
});

// Apply rate limiter to all API routes
app.use("/api/v1", limiter);

app.use("/api/v1", router);

app.use(notFound);
app.use(globalErrorHandelar);

export default app;
