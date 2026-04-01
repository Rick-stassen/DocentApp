import express from "express";
const app = express();
app.use(express.json());
export async function Push_learned_words(_req, res, db) 
{
    const { id, word, correct, litwoord, token } = _req.body;

    console.log("now send to db", id)
    await db.execute(
        "INSERT INTO learned_word (id, word, correct, litwoord, user_sesion_id) VALUES (?, ?, ?, ?, ?)",
        [id, word, correct, litwoord, token]
    );
    console.log("sent to db", id)
}