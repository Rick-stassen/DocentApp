// import { getSession } from "../stotage.mjs";
export async function Get_item_words(_req, res, db)
{

    // const token = await getSession();

    const token = _req.headers.authorization?.split(" ")[1];

    console.log(token);

    const [rows] = await db.execute(`
        SELECT cw.id, cw.word, a.article
        FROM curatedword cw
        LEFT JOIN article_curatedword acw ON cw.id = acw.curatedword_id
        LEFT JOIN article a ON acw.article_id = a.id
        WHERE cw.id NOT IN (
            SELECT id
            FROM learned_word lw
            WHERE lw.user_sesion_id = ?
        )
        ORDER BY RAND();
    `, [token]);

    return rows;
}