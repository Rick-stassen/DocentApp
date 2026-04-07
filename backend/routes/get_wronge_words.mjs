export async function get_wronge_words(req, res, db) 
{
  try 
  {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) 
    {
      return [];
    }

    const userId = token;

    const [rows] = await db.execute
    (
      `SELECT * 
       FROM learned_word
       WHERE correct = 0
       AND user_sesion_id = ?`,
      [userId]
    );

    return rows;

  } 
  catch (err) 
  {
    console.log(err);
    throw err;
  }
}