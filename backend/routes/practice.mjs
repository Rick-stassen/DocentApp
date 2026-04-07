export async function get_wronge_words(req, res, db) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      // return [];
      console.log("No token provided");
      return res.status(401).json({ error: "Unauthorized" });
    }

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
      WHERE lw.correct = 0
      AND lw.user_sesion_id = ?
    `, [token, token]);

    return rows;

  } catch (err) {
    console.log(err);
    throw err;
  }
}