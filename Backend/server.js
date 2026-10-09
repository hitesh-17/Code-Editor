import express from "express"
import {createServer} from "http"
import { Server } from "socket.io"
import { YSocketIO } from 'y-socket.io/dist/server'
import dotenv from 'dotenv'
dotenv.config();

const app = express()
app.use(express.static("public"))
const httpserver = createServer(app)
const port = process.env.PORT;

app.use(cors({origin: process.env.CLIENT_URL,credentials: true}));

const io = new Server(httpserver,{
    cors :{
        origin:'*',
        methods : ["GET","POST"]
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