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

        // it('should not create a new token with an existing name', async () => {
        //     //A token with an existing name should not be minted
        //     await contract._mint('Nyfti').should.be.rejected;
        // })
    })

    let statBlock
    describe('requesting stats', async() => {
        it('should get stats by index', async () => {
            statBlock = await contract.getStatBlock(0);
            assert.equal(statBlock.name, "Nyfti");
            assert.equal(statBlock.attackPower, '100');
            assert.equal(statBlock.speed, '150');
            assert.equal(statBlock.health, '50');
            assert.equal(statBlock.currHealth, '50');
        })
    })
});