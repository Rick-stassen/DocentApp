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
      "SELECT id, word FROM curatedword"
    );

    const result = [];

    for (const row of rows) {
      const [links] = await db.execute(
        "SELECT article_id FROM article_curatedword WHERE curatedword_id = ?",
        [row.id]
      );

      let article = null;

      if (links.length > 0) {
        const [articleRows] = await db.execute(
          "SELECT article FROM article WHERE id = ?",
          [links[0].article_id]
        );
        article = articleRows[0];
      }

      result.push({
        ...row,
        article
      });
    }

    res.json(result);
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