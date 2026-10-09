import express from "express"
import {createServer} from "http"
import { Server } from "socket.io"
import { YSocketIO } from 'y-socket.io/dist/server'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();

const app = express()
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(express.static("public"))
app.use(cors({origin: allowedOrigins, credentials: true}));
const httpserver = createServer(app)
const port = process.env.PORT;

const io = new Server(httpserver,{
    cors :{
        origin:allowedOrigins,
        methods : ["GET","POST"],
        credentials: true
    }
});

const ySocketIO = new YSocketIO(io)
ySocketIO.initialize()

app.get('/',(req,res) => res.send("server is runnig !!!"))

app.get('/health', (req, res) =>  res.status(200).json({
    message : "ok",
    success : true
}))

httpserver.listen(port, () => console.log(`server listening on port ${port}!`))