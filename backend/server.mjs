import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "wordplay"
});

console.log("Connected to MySQL");

app.get("/items", async (_req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, word FROM word_backup"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/litword", async (_req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, article FROM article"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/WordConnect", async (_req, res) => {
  try {const [rows] = await db.execute(
    "SELECT id, article_id, curratedword_id FROM article_curatedword"
  );
  res.json(rows);
} catch (err) {
  res.status(500).json({ error: err.message })
}
})

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});