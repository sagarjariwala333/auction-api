const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require('http');
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const userRoute = require("./Routes/UserRoute");
const WebSocket = require('ws');
// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });
const {Server} = require("socket.io");
const { v4: uuidv4 } = require('uuid');
const { verifyUser } = require("./Middlewares/AuthMiddleware");
const { InsertItem, insertAnItem, getAllItemsSocket, updatePrice, sellItem } = require("./Controllers/ItemController");
const server = http.createServer(app)

const io = new Server(server,{
  cors:{
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
  });

  server.listen(3001, () => {
    console.log(`Server is listening on port 3001`);
  });
  

  io.on("connection", async (socket)=>{
    console.log("User connected:" + socket.id)

    // socket.on("send_message",async (data)=>{
    //   socket.broadcast.emit("receive_message", data)
    // })

    socket.on("send_message",async (data) => {
      const result = await insertAnItem(data)
      const allitems = await getAllItemsSocket();
      socket.emit("receive_message",allitems)
    })

    socket.on("connection",()=>{
      console.log("handshake....")
    })

    socket.on("item_insert",async (data) => {
      const result = await insertAnItem(data)
      const allitems = await getAllItemsSocket();
      socket.emit("getall_item",allitems)
      socket.broadcast.emit("getall_item",allitems)
    })

    socket.on("update_price", async (data) => {
      const result = await updatePrice(data.id, data.price, data.token)
      const allitems = await getAllItemsSocket();
      socket.emit("getall_item",allitems)
      socket.broadcast.emit("getall_item",allitems)
    })

    socket.on("sell_item", async (data) => {
      const result = await sellItem(data.id, data.token)
      const allitems = await getAllItemsSocket();
      socket.emit("getall_item",allitems)
      socket.broadcast.emit("getall_item",allitems)
    })
  })

const MONGO_URL =
  "mongodb+srv://sagarjariwala333:12345@cluster0.e1cwkzm.mongodb.net/?retryWrites=true&w=majority";
const PORT = 4000;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

  const todos = [];

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/", authRoute);
app.use("/user/", userRoute);
