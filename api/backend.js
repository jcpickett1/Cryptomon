const NodeCouchDb = require('node-couchdb');
const couch = new NodeCouchDb({
    host: '127.0.0.1',
    port: 5984,
    auth: {
        user: 'admin',
        pass: 'pwd'
    }
});

var queue = [/* array of objects of player stats */];
var arenas = [/* array of battle objects containing both players' stats */]

async function action(arena, position) {
    let battle = arenas[arena - 1];
    let pos = (position == 0) ? 1 : 0;
    battle[pos].currHealth -= battle[position].attackPower / 10;
    return null;
}

async function confirmBattle(account) {
    let battleData = couch.get('arenas', account + queue[0].account);
    queue = [];
    return battleData;
}

async function enterQueue(stats, account) {
    queue.push(stats);
    if(queue[1]) {
        arenas.push(queue);
        queue = [];
        return { complete: true, position: queue.length - 1, docId: arenas.length, gameId: arenas.length }
    }
    return { complete: false, position: queue.length - 1, gameId: arenas.length + 1 }
}

async function updateBattle(arenaId) {
    return arenas[arenaId - 1];
}

module.exports = { action, enterQueue, confirmBattle, updateBattle }