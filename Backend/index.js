const express = require("express");
const programmingLanguagesRouter = require("./routes/programmingLanguages");
const authRouter = require("./routes/auth");
const cors = require('cors');
const app = express();

const port = 5000;
const corsOption = {
  origin: ['http://localhost:3000'],
};
app.use(cors(corsOption));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/jwt", programmingLanguagesRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});