import express from "express";
import path from "path";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use("/users", userRoutes);
app.get("/", (_req, res) => {
  res.sendFile("index.html", { root: "public" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
