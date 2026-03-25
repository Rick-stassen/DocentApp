export async function Get_item_words(_req, res, db)
{
    const [rows] = await db.execute(`
        SELECT cw.id, cw.word, a.article FROM curatedword cw
        LEFT JOIN article_curatedword acw ON cw.id = acw.curatedword_id
        LEFT JOIN article a ON acw.article_id = a.id ORDER BY RAND();
    `);

    return rows;
}