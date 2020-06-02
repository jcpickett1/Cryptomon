const Cryptomon = artifacts.require('./Cryptomon.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Cryptomon', (accounts) => {
    let contract;

    before(async () => {
        contract = await Cryptomon.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', () => {
            const address = contract.address;
            assert(address);
            assert.notEqual(address, '0x0');
        })

        it('is named correctly', async () => {
            const name = await contract.name();
            assert.equal(name, "Cryptomon");
        })

        it('has the correct symbol', async () => {
            const symbol = await contract.symbol();
            assert.equal(symbol, "CMON");
        })
    })

    describe('minting', async () => {
        it('create a new token', async () => {
            await contract.mint('Tandy', 0, 0, 0, 0);
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 1);
        })

        it('should have a new token with given name', async () => {
            const name = await contract.checkName('Tandy');
            assert(name);
        })

        it('should not create a new token with an existing name', async () => {
            //A token with an existing name should not be minted
            await contract.mint('Tandy', 0, 0, 0, 0).should.be.rejected;
        })
    })

    describe('indexing', async() => {
        it('should list stored names', async () => {
            await contract.mint('Randy', 0, 0, 0, 0);
            await contract.mint('Sandy', 0, 0, 0, 0);
            await contract.mint('Andy', 0, 0, 0, 0);
            const expected = ['Tandy', 'Randy', 'Sandy', 'Andy'];

            //Check if all newly added names exist in contract
            const totalSupply = await contract.totalSupply();
            for(let i = 0; i < totalSupply; i++) {
                assert.equal(await contract.names(i), expected[i]);
            }
        })
    })

    describe('renaming', async () => {
        it('should rename a token', async () => {
            await contract.rename('Randy', 'Blandy');

            //Check that old name is gone
            let name = await contract.checkName('Randy');
            assert(!name);

            //Check if the new name is registered
            name = await contract.checkName('Blandy');
            assert(name);
        })

        it('should reassign token ownership', async () => {
            //Token 'Randy' should belong to 0x0
            randy = await contract.checkOwner('Randy');
            assert.equal(randy, '0x0000000000000000000000000000000000000000');

            blandy = await contract.checkOwner('Blandy');
            assert.equal(blandy, accounts[0]);
        })
    })

    let statBlock;
    describe('handling stats', async() => {
        it('should get stats by index', async () => {
            //Data contained in statblock should match minted variables
            statBlock = await contract.getStatBlock(0);
            assert.equal(statBlock.name, "Tandy");
            assert.equal(statBlock.attackPower, '0');
            assert.equal(statBlock.speed, '0');
            assert.equal(statBlock.health, '0');
            assert.equal(statBlock.currHealth, '0');
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
            assert.equal(_hp.currHealth, '0');
        })
    })
});