const app = require('express')();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// var app = express();
var arenas = [/* array of objects battle#: { player1: {player1 stats+abilities}, player2: {player2 stats+abilities} } */];
var queue = [/* array of objects of player stats */];

app.use(cookieParser());
app.use(bodyParser.json());

app.post('/', async (req, res, next) => {
    return res.send('success');
});

app.post('/initiate', async (req, res, next) => {
    let {stats} = req.body;
    if(queue.length >= 1) {
        queue = [];
        arenas.push({ playerOne: stats, playerTwo: queue[0] });
    }
    else
    {
        queue.push(stats);
    }
    return res.cookie( "position", arenas.length, { maxAge: 900000, httpOnly: true }).send();
});

app.post('/action', async (req, res, next) => {
    let arena = req.cookies.position;
    console.log(arena);
    return res.send(200);
});

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', () => {

});
server.listen(5000);
// app.listen(5000);