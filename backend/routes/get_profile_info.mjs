export async function Get_profile_info(req, res, db) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  const [rows] = await db.execute(
    "SELECT id, word, correct, litwoord FROM learned_word WHERE user_sesion_id = ?",
    [token]
  );

  res.json(rows);
}