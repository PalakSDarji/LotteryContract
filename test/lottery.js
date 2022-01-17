const Lottery = artifacts.require("Lottery");

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('Lottery', (accounts) => {

  let lottery;

  before(async ()=>{
    lottery = await Lottery.deployed();
  });

  describe('deployment', async ()=> {
    it('deploys successfully', async ()=>{
      const address = await lottery.address;
      assert.notEqual(address,0x0);
      assert.notEqual(address,'');
      assert.notEqual(address,null);
      assert.notEqual(address,undefined);
    });

    it('has a manager initialized', async ()=>{
      const manager = await lottery.manager();
      assert.notEqual(manager,0x0);
      assert.notEqual(manager,'');
      assert.notEqual(manager,null);
      assert.notEqual(manager,undefined);
      assert.equal(manager,accounts[0]);
    });
  });

  describe('enter the lottery', async ()=>{
    it('works fine with manager account', async ()=> {
      await lottery.enter({from: accounts[0]});
      const firstPlayer = await lottery.players(0);
      assert.equal(firstPlayer,accounts[0]);
    });

    it('works fine with another account', async ()=> {
      await lottery.enter({from: accounts[1]});
      const secondPlayer = await lottery.players(1);
      assert.equal(secondPlayer,accounts[1]);
    });
  });
});
