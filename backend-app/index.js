import express from "express";
import morgan from "morgan";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { connectDB } from "./db/connectdb.js";
import quizModel from "./Model/question.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.static(path.join(__dirname + "/public")));
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const port = 4000;
connectDB();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/submit", async (req, res) => {
  const { question, option1, option2, option3, option4, answer } = req.body;
  // console.log(question, option1, option2, option3, option4, answer);
  const q = new quizModel({
    question: question,
    option1: option1,
    option2: option2,
    option3: option3,
    option4: option4,
    answer: answer,
  });
  await q.save();
  res.status(200).send({
    message: "Successfully data is inserted",
    data: q,
  });
});

app.get("/getAll", async (req, res) => {
  const listData = await quizModel.find({});
  res.status(200).send({
    message: "Successfully all the data is fetched",
    data: listData,
  });
});

app.get("/quiz/:id", async (req, res) => {
  const data = await quizModel.findById({ _id: req.params.id });
  res.status(200).send({
    message: "Successfully data id fetched",
    data: data,
  });
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
