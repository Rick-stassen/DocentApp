export async function login_user(req, res, db) {
    const { email, password } = req.body;

    const [rows] = await db.execute(
        "SELECT id, password FROM users WHERE email = ? AND password = ?",
        [email, password]
    );

    if (rows.length === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    return res.status(200).json({
        message: "Login successful",
        userId: user.id
    });
}