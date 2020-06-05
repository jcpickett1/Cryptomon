const app = require('express')();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { action, enterQueue, confirmBattle, updateBattle } = require('./backend');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.post('/', async (req, res, next) => {
    return res.send('success');
});

app.get('/updateBattle', async (req, res, next) => {
    console.log(req.query.arena);
    let battleInfo = await updateBattle(req.query.arena);
    return res.status(200).send(battleInfo);
})

app.post('/initiate', async (req, res, next) => {
    let { stats, account } = req.body;
    let battle = await enterQueue(stats, account);
    if (battle.complete) {
        io.emit('battleFound', battle.docId);
        // return res.cookie( "battleInfo", { docId: battle.docId, arenaPosition: battle.position }, { maxAge: 900000, httpOnly: true }).status(200).send();
        return res.status(200).send({ position: 1 });
    }

    // return res.status(200).cookie( "battleInfo", { docId: battle.docId, arenaPosition: battle.position }, { maxAge: 900000, httpOnly: true }).send();
    return res.status(200).send({ position: 0 });
});

app.post('/battleAction', async (req,res,next) => {
    let { arena, position } = req.body;
    let action2 = await action(arena, position);
    io.emit('updateBattle', req.body);
    return res.status(200).send();
});

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', () => {
    // console.log('user connected');
});

server.listen(5000);
// app.listen(5000);