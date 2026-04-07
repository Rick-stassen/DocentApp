export async function get_wronge_words(_req, res, db) 
{
    const { token } = _req.body;

    const [rows] = await db.execute(
        "SELECT word FROM learned_word WHERE user_sesion_id = ? AND correct = 0",
        [token]
    );
    return rows.map(row => row.word);   
}