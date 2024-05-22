import express, { Request, Response } from "express";

const app = express();
const port = 3002;

export const middlewares = [
  express.json({}),
  express.urlencoded({ extended: true }),
];

middlewares.forEach((middleware) => {
  app.use(middleware);
});

app.get("/v1/ping", (_: Request, res: Response) => {
  res.send("Pong");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
