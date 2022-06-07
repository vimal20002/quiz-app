import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
//configuration 
const port = process.env.PORT||1000;
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));




// Mongodb connection
const uri = `mongodb+srv://vim9517:${process.env.PASSWORD}@cluster0.qjgysvu.mongodb.net/?retryWrites=true&w=majority`;
try {
  mongoose.connect(uri)
  console.log("connected to server");
} catch (error) {
  console.log(error);
}


//Question schema
const questions = mongoose.model(
  "question_record",
  new mongoose.Schema({
    Question: String,
    Ans: String,
    a: String,
    b: String,
    c: String,
    d: String,
    _id: String,
  })
);


//edit ans 
const qn = await questions.find();
const realData = await questions.find();
for (let index = 0; index < qn.length; index++) {
  qn[index].Ans = "";
}
//routes

//get question data
app.get("/", async (req, res) => {
  try {
    if (qn) {
      res.status(200).json(qn);
    }
  } catch (error) {
    res
      .status(404)
      .json({ message: ` Data not found due to ${error.message}` });
  }
});


//calculate score
var showAns;
app.post("/getScore", async (req, res) => {
  var score = 0;
  const { selop, selqn } = req.body;
  try {
    showAns = [];
    selqn.map(async (item, i) => {
      realData.map(async (q) => {
        if (q._id === item._id) {
          showAns.push(q);
          if (selop[i] === q?.Ans) {
            score++;
          }
        }
      });
    });
    setTimeout(() => {
      res.status(200).json({ score: score });
    }, 2000);
  } catch (error) {
    res.status(400).json({ message: "can't calculate your score" });
  }
});


//get selected  question
app.get("/getAns", async (req, res) => {
  try {
    res.status(200).json(showAns);
  } catch (error) {
    res.status(400).json({ message: "can't get answers" });
  }
});




//app listening at 1000

app.listen(port, () => {
  console.log(`app is running at port ${port}`);
});
