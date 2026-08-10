import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { IndexRoutes } from "./app/routes";

const app: Application = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cookieParser());

app.use("/api/v1", IndexRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Healthcare API");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
