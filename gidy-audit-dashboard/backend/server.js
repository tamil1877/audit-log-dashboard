import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import logsRouter from "./routes/logs.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
// bumping the JSON body limit up - 10,000 log records in one payload
// is well past Express's default 100kb limit
app.use(express.json({ limit: "20mb" }));

app.use("/api/logs", logsRouter);

app.get("/", (req, res) => {
  res.send("Audit log dashboard API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
