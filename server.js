import express from "express";
import { generate } from "./chatbot.js";

const app = express();
const port = 3001;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hey");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const result = await generate(message);

  res.json({ message: result });
}); 

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
