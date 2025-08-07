import express from "express";
import { transactionsRouter } from "./routes/transations.route.js";
const server = express();
const PORT = process.env.PORT || 8080;

server.use(transactionsRouter);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));