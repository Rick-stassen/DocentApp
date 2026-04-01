export async function register_user(_req, res, db) {
    const { email, username, password } = _req.body;


        const [emailRows] = await db.execute
        (
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (emailRows.length > 0) 
        {
            return res.status(400).json({ error: "Email already exists" });
        }

        const [usernameRows] = await db.execute
        (
            "SELECT id FROM users WHERE username = ?",
            [username]
            
        );

        if (usernameRows.length > 0) 
        {             
            return res.status(400).json({ error: "Username already exists" });
        }


        console.log(emailRows.length, usernameRows.length);
        await db.execute
        (
            "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
            [email, username, password]
        );
        


    return res.status(201).json({ message: "User created" });



    // console.log('Received registration request:', { email, username });
    // const [emailRows] = await db.execute
    // (
    //     "SELECT id FROM users WHERE email = ?",
    //     [email]
    // );

    // const [usernameRows] = await db.execute
    // (
    //     "SELECT id FROM users WHERE username = ?",
    //     [username]
    // );

    // console.log('Email rows:', emailRows);
    // console.log('Username rows:', usernameRows);

    // switch (true) 
    // {
    //     case emailRows.length > 0:
    //         console.log('Duplicate email detected');
    //         return res.status(400).json({ error: "Email already exists" });
    //     case usernameRows.length > 0:
    //         console.log('Duplicate username detected');
    //         return res.status(400).json({ error: "Username already exists" });
    //     default:
    //         console.log('Inserting new user');
    //         await db.execute
    //         (
    //             "INSERT INTO users (email, username, password) VALUES (?, ?, ?)",
    //             [email, username, password]
    //         );
    //         return res.status(201).json({ message: "User created" });
    // }
}