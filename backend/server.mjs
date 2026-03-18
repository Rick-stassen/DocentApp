import { exec } from "child_process";
import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";

export default function handler(req, res) {
    exec("python get_ip.py", (err, stdout) => {
        if (err) {
            res.status(500).json({ error: "failed" });
            return;
        }

        res.status(200).json({ ip: stdout.trim() });
    });
}

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
    const [rows] = await db.execute(`
      SELECT cw.id, cw.word, a.article FROM curatedword cw
      LEFT JOIN article_curatedword acw ON cw.id = acw.curatedword_id
      LEFT JOIN article a ON acw.article_id = a.id ORDER BY RAND();
    `);

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
  try {
    const [rows] = await db.execute(
      "SELECT * FROM article_curatedword "
    );
    console.log("WordConnect rows:", rows);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
