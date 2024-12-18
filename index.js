import express from "express"
import { createServer } from "http"
import "dotenv/config"
import path from "path"
import { Server } from "socket.io"
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';


// create an express app
const app = express();

// create a server that accepts incoming requests and passes them to the express app
const server = createServer(app);

// create an instance of the socket.io server and pass it the server we just created
const io = new Server(server);
app.use(express.static(path.join(process.cwd(), "public")));
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    return res.sendFile('./public/index.html')
})

io.on('connection', (socket) => {
    // console.log('a user connected ',socket.id)
    const shortName = uniqueNamesGenerator({
        dictionaries: [adjectives, animals], // colors can be omitted here as not used
        length: 2
    });
    socket.emit("name",shortName)
    socket.on("chat message", (message, callback) => {
        // console.log("msg",message)
        socket.broadcast.emit("chat message", message);
        callback();
    })
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
