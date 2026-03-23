import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";



const app = express();
app.use(cors());
app.use(express.json());

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

app.post('/learned', (req, res) => {
  const { id, word, correct,litwoord } = req.body;

  const sql = `
    INSERT INTO learned_word (id, word, correct, litwoord)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [id, word, correct, litwoord], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'DB error' });
    }

    res.json({ success: true });
  });
});

app.get('/stats', async (req, res) => {
  try {
    const sql = 
    `SELECT COUNT(*) as total, SUM(correct = true) as correct FROM learned_word`

    const [rows] = await db.query(sql);

    res.json(rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
