import express from "express";
const app = express();
app.use(express.json());
export async function Push_learned_words(_req, res, db) 
{
    const { id, word, correct, litwoord } = _req.body;

    await db.execute(
        "INSERT INTO learned_word (id, word, correct, litwoord) VALUES (?, ?, ?, ?)",
        [id, word, correct, litwoord]
    );
}