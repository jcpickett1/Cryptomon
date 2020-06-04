const Nyfti = artifacts.require('./Nyfti.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Nyfti', (accounts) => {
    let contract;

    before(async () => {
        contract = await Nyfti.deployed()
    })

    describe('deployment', async () => {
        it('should deploy successfully', async () => {
            assert(contract.address)
        })

        it('is named correctly', async () => {
            const name = await contract.name();
            assert.equal(name, "Nyfti");
        })

        it('has the correct symbol', async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol, "NFT");
        })
    })

    describe('minting', async () => {
        it('create a new token', async () => {
            await contract._mint('Nyfti');
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 1);
        })

        it('should have a new token with given name', async () => {
            const name = await contract.checkName('Nyfti');
            assert(name);
        })
    })

    let statBlock
    describe('requesting stats', async() => {
        it('should get stats by index', async () => {
            statBlock = await contract.getStatBlock(0);
            assert.equal(statBlock.abilities.join(','), [ 'Fly', 'Fairy Dust', 'Glamour', 'Mire' ].join(','));
            assert.equal(statBlock.name, "Nyfti");
            assert.equal(statBlock.attackPower, '100');
            assert.equal(statBlock.speed, '150');
            assert.equal(statBlock.health, '50');
            assert.equal(statBlock.currHealth, '50');
        })

        it('should get all statblocks associated with address', async () => {
            //Check if all tokens have the appropriate index
            const resp = await contract.getStatsList();
            //Expect 4 coins minted during tests
            assert.equal(resp.length, 1);
        })

        it('should update health', async () => {
            //Set current health to 10
            await contract.updateHealth(0,10);
            _hp = await contract.getStatBlock(0);
            assert.equal(_hp.currHealth, '10');
        })

        it('should take damage', async () => {
            //Should decrement current health
            await contract.damage(0, 5);
            _hp = await contract.getStatBlock(0);
            assert.equal(_hp.currHealth, '5')
        })

        it('should restore health', async () => {
            //Reset current health to maximum
            await contract.rest(0);
            _hp = await contract.getStatBlock(0);
            assert.equal(_hp.currHealth, '50');
        })
    })
});