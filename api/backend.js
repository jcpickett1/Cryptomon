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
var arenasMirror = [];

async function attack(arena, position) {
    let battle = arenas[arena - 1];
    let pos = (position == 0) ? 1 : 0;
    battle[pos].currHealth -= battle[position].attackPower / 10;
    return null;
}

async function enterQueue(stats) {
    if(queue[0]) {
        if(stats.speed >= queue[0].speed) {
            stats.active = true;
            queue[0].active = false;
        } else {
            stats.active = false;
            queue[0].active = true;
        }
    }
    queue.push(stats);
    if(queue[1]) {
        arenas.push(queue);
        let position = queue.length - 1;
        queue = [];
        return { complete: true, position: position, docId: arenas.length, gameId: arenas.length }
    }
    return { complete: false, position: queue.length - 1, gameId: arenas.length + 1 }
}

async function updateBattle(arenaId) {
    return arenas[arenaId - 1];
}

async function turnWarden(arena, position, action={}) {
    //Check if acting player is on turn
    if(!arenas[arena - 1][position].active) {
        return false;
    }
    let other = position == 1 ? 0 : 1;

    //check if player is using an additional effect
    if(action) {
        if(action.target == position) {
            arenasMirror[arena - 1] = arenas[arena - 1];
            arenasMirror[arena - 1][position][action.stat] += action.magnitude;
            // return arenasMirror[arena][position];
        } else {
            arenasMirror[arena - 1] = arenas[arena - 1];
            arenasMirror[arena - 1][other][action.stat] -= action.magnitude;

            arenas[arena - 1][position].active = false;
            arenas[arena - 1][other].active = true;

            return arenasMirror[arena - 1] ? arenasMirror[arena - 1][other] : arenas[arena - 1][other];
        }
    }

    arenas[arena - 1][position].active = false;
    arenas[arena - 1][other].active = true;
    // return arenasMirror[arena - 1];
    return arenasMirror[arena - 1] ? arenasMirror[arena - 1][position] : arenas[arena - 1][position];
}

module.exports = { attack, enterQueue, updateBattle, turnWarden, queue, arenas }