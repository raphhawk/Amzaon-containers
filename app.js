
const express  = require("express");
const mongoose = require("mongoose");
const session  = require("express-session");
const redis    = require("redis");

let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient({

});

const { 
  MONGO_IP,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASSWORD
}                = require("./config/config");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const port     = process.env.PORT || 8080;
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const app = express();

const connectWithRetry = ()=>{
  mongoose
    .connect(mongoURL)
    .then(()=>console.log("successfully connected to DB"))
    .catch((e)=>{
      console.log(e)
      setTimeout(connectWithRetry, 5000)
    });
};

connectWithRetry();

app.use(express.json());

app.get("/", (req, res, next)=>{
  res.send("<h2>Hi There!!!</h2>");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter );

app.listen(port, ()=>console.log(`listening to port ${port}`));
