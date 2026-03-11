import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors());
app.use(express.json());

let messages = [];

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  messages.push(req.body);
  res.json({ status: 'success' });
});
app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.listen(3000, () => console.log("http://localhost:3000"));