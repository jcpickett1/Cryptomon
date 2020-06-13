var chai = require('chai');
var assert = require('chai').assert;
var chaiHttp = require('chai-http');
var { attack, enterQueue, updateBattle, turnWarden, queue, arenas } = require('../backend');

chai.use(chaiHttp);
chai.should();

describe('test backend api', async () => {

    it('should add a player statblock to the queue', async () => {
        let result = await enterQueue({ name: 'test1', currHealth: 100, attackPower: 50, speed: 100 });
        assert.equal(queue[0].name, 'test1');
        assert.equal(result.complete, false);
        assert.equal(result.position, 0);
    });
    
    it('should confirm a new battle with a second enqueue', async () => {
        assert.equal(arenas.length, 0);
        let result = await enterQueue({ name: 'test2', currHealth: 100, attackPower: 50, speed: 100 });
        assert.equal(queue[1].name, 'test2');
        assert.equal(result.complete, true);
        assert.equal(result.position, 1);
        assert.equal(queue[0].active, false);
        assert.equal(queue[1].active, true);
    });

    it('should get battle information by ID', async () => {
        let result = await updateBattle(1);
        assert.equal(result[0].name, 'test1');
        assert.equal(result[1].name, 'test2');
        assert.equal(result[0].currHealth, 100);
        assert.equal(result[1].currHealth, 100);
        assert.equal(result[0].attackPower, 50);
        assert.equal(result[1].attackPower, 50);
    });

    it('should prevent offturn player actions', async () => {
        let result = await turnWarden(1,0);
        assert(!result);
        result = await turnWarden(1,1);
        assert(result);
        result = await turnWarden(1,1);
        assert(!result);
    });

    it('should track buff/debuff duration', async () => {
        let result = await turnWarden(1,0,{ stat: 'speed', target: 0, magnitude: 25, duration: 3 });
        assert.equal(result.speed, 125);
        result = await turnWarden(1,1,{ stat: 'attackPower', target: 0, magnitude: 25, duration: 3 });
        assert.equal(result.attackPower, 25);
    });

    it('should update battle information given arena and position', async () => {
        let result = await attack(1, 0);
        assert.equal(result, null);
        assert.equal(arenas[0][0].name, 'test1');
        assert.equal(arenas[0][1].currHealth, 97.5);
    });
});