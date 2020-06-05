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

async function action(arena, position) {
    console.log(arena);
    let prev = await couch.get("arenas", arena);
    console.log(prev);
    let battle = prev.data.battle;
    let pos = position == 0 ? 1 : 0;
    battle[pos].currHealth -= 10;
    couch.update("arenas", {
        _id: arena,
        _rev: prev.data._rev,
        battle: battle
    });
    return null;
}

async function confirmBattle(account) {
    let battleData = couch.get('arenas', account + queue[0].account)
    queue = [];
    return battleData;
}

async function enterQueue(stats, account) {
    // if(queue.length >= 1) {
    //     couch.update("arenas", { _id: queue[0].id, _rev: '1-complete', one: stats });
    //     return  { complete: true, position: 1, doc: queue[0].id };
    // }
    // else
    // {
    //     let data = { zero: stats };
    //     let insert = await couch.insert("arenas", data);
    //     data.docId = insert.data.id;
    //     queue.push(data);
    //     return { complete: false, position: 0, docId: insert.data.docId };
    // }
    queue.push(stats);
    var insert;
    if(queue[1]) {
        // if(queue[1].currHealth) {
            insert = await couch.insert("arenas", { battle: queue });
            queue = [];
            return { complete: true, position: queue.length - 1, docId: insert.data.id }
        // }
    }
    return { complete: false, position: queue.length - 1 }
}

async function updateBattle(arenaId) {
    return await couch.get("arenas", arenaId);
}

module.exports = { action, enterQueue, confirmBattle, updateBattle }