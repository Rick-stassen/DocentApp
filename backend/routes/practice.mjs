export async function get_wronge_words(req, res, db) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    console.log("TOKEN:", token);

    const [rows] = await db.query(`
      SELECT lw.*
      FROM learned_word lw
      INNER JOIN (
          SELECT word, MAX(id) as max_id
          FROM learned_word
          WHERE user_sesion_id = ?
          GROUP BY word
      ) latest
      ON lw.id = latest.max_id
      WHERE lw.user_sesion_id = ?
      AND lw.correct = 0
    `, [token, token]);

    return res.json(rows);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
}