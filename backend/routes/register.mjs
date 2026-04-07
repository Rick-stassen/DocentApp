export async function register_user(_req, res, db) {
    const { email, username, password, tags } = _req.body;

    const [emailRows] = await db.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );
    const[TagsRows] = await db.execute(
        "SELECT id FROM tags WHERE name = ?",
        [tags]
    );

    if (emailRows.length > 0) {
        return res.status(400).json({ error: "Email already exists" });
    }

    if (TagsRows.length > 0) {
        return res.status(400).json({ error: "Tag already exists" });
    }

    await db.execute(
        "INSERT INTO users (email, username, password, tags) VALUES (?, ?, ?, ?)",
        [email, username, password, tags]
    );

    return res.status(201).json({ message: "User created" });
}