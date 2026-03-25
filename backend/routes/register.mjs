export async function register_user(req, res, db) {
    const { email, username, password } = req.body;

        const [emailRows] = await db.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (emailRows.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const [usernameRows] = await db.execute(
            "SELECT id FROM users WHERE username = ?",
            [username]
        );

        if (usernameRows.length > 0) {
            return res.status(400).json({ error: "Username already exists" });
        }

    await db.execute(
        "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
        [email, username, password]
    );

    return res.status(201).json({ message: "User created" });
}