const app = require('express')();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { attack, enterQueue, updateBattle } = require('./backend');

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.post('/', async (req, res, next) => {
    return res.send('success');
});

app.get('/updateBattle', async (req, res, next) => {
    let battleInfo = await updateBattle(req.query.arena);
    return res.status(200).send(battleInfo);
})

app.post('/initiate', async (req, res, next) => {
    let { stats, account } = req.body;
    let battle = await enterQueue(stats);
    if (battle.complete) {
        io.emit('battleFound', battle.docId);
        return res.status(200).send({ position: 1 });
    }

    return res.status(200).send({ position: 0 });
});

app.post('/battleAction', async (req,res,next) => {
    let { arena, position } = req.body;
    await attack(arena, position);
    io.emit('updateBattle' + arena, req.body);
    return res.status(200).send();
});

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', () => {});

server.listen(5000);