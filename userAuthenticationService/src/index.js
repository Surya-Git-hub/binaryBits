const express = require("express");
const bodyParser = require("body-parser");

const workoutRouter = require("./routes/workoutRoutes");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.send("<h2>It's Working!</h2>");
});


app.use('/api/workouts',workoutRouter);

app.listen(PORT, () => {
    console.log(`API is listening on port ${PORT}`);
});