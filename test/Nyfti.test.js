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
        it('deploys successfully', () => {
            const address = contract.address;
            assert(address);
            assert.notEqual(address, '0x0');
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
            const result = await contract.mint('Tandy');
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 1);
        })

        it('should have a new token with given name', async () => {
            const name = await contract.checkName('Tandy');
            assert(name);
        })

        it('should not create a new token with an existing name', async () => {
            //A token with an existing name should not be minted
            await contract.mint('Tandy').should.be.rejected;
        })
    })

    describe('indexing', async() => {
        it('should list stored names', async () => {
            await contract.mint('Randy');
            await contract.mint('Sandy');
            await contract.mint('Andy');
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
});