export async function Get_profile_info(_req, res, db)
{
    const [rows] = await db.execute(
      "SELECT * FROM learned_word"
    );
    return rows;

}