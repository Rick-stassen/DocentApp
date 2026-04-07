import cors from "cors";
import express from "express";
import mysql from "mysql2/promise";

import { Get_profile_info } from "./routes/get_profile_info.mjs";
import { Get_item_words } from "./routes/get_words.mjs";
import { login_user } from "./routes/login.mjs";
import { get_wronge_words } from "./routes/practice.mjs";
import { Push_learned_words } from "./routes/push_learned_words.mjs";
import { register_user } from "./routes/register.mjs";



const app = express();
app.use(cors());
app.use(express.json())

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "wordplay"
});

console.log("Connected to MySQL");

app.get("/items", async (_req, res) => 
  {
    try 
    {
      res.json(await Get_item_words(_req, res, db));
    } 
    catch (err) 
    {
      res.status(500).json({ error: err.message });
    }
  }
);

app.post("/learned_word", async (_req, res) => 
  {
    try 
    {
      await Push_learned_words(_req, res, db);

    } 
    catch (err) 
    {
      console.log(err);
      res.status(500).json({ error: 'DB error' });
    }
  }
);

app.post("/register", async (_req, res) => 
  {
    try
    {
      res(await register_user(_req, res, db));
      
    } 
    catch (err) 
    {
      console.log(err);
      res.status(500).json({ error: 'DB error' });
    }
  }
);

app.post("/login", async (_req, res) => {
  try 
  {
    await login_user(_req, res, db);
  } 
  catch (err) 
  {
    console.log(err);
    return res.status(500).json({ error: "DB error" });
  }
});

app.get("/practice", async (_req, res) => 
{
  try 
  {
    res.json(await get_wronge_words(_req, res, db));
  }
  catch(err)
  {
    res.status(500).json({ error: err.message });
  }
});

app.get("/profile", async (_req, res) => {
  try
  {
    res.json(await Get_profile_info(_req, res, db));
  } 
  catch(err) 
  {
    res.status(500).json({ error: err.message});
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
