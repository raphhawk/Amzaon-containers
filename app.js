
const express  = require("express");
const mongoose = require("mongoose");
const session  = require("express-session");
const redis    = require("redis");
const cors     = require("cors");

let RedisStore  = require("connect-redis")(session);
const { 
  MONGO_IP,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASSWORD,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
}                = require("./config/config");
const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

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

app.enable("trust proxy");

app.use(cors({}));
app.use(session({
  store:  new RedisStore({client: redisClient}),
  secret: SESSION_SECRET, 
  cookie: {
    secure: false,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    maxAge: 30000,
  },
}));

app.use(express.json());

app.get("/api/v1", (req, res, next)=>{
  res.send("<h2>Hi There!!!</h2>");
  console.log("it ran for real");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter );

app.listen(port, ()=>console.log(`listening to port ${port}`));
