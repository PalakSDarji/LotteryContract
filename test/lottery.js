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
      await lottery.enter({from: accounts[0], value: web3.utils.toWei('0.02','ether')});
      const firstPlayer = await lottery.players(0);
      assert.equal(firstPlayer,accounts[0]);
    });

    it('works fine with another account', async ()=> {
      await lottery.enter({from: accounts[1], value:web3.utils.toWei('0.02','ether')});
      const secondPlayer = await lottery.players(1);
      assert.equal(secondPlayer,accounts[1]);
    });

    it('can get players', async ()=> {
      const players = await lottery.getPlayers();
      assert.isAtLeast(players.length,1);
    });

    it('fails if less ether is passed', async ()=> {
      try{
        await lottery.enter({from : accounts[2], value : 0});
        assert(false);
      } catch(err){
        assert(err);
      }
    });

    it('only manager can call pickWinner', async ()=> {
      try{
        await lottery.pickWinner({from : accounts[2]});
        assert(false);
      } catch(err) {
        assert(err);
      }
    });
  });

  describe('lottery winning', async ()=> {
    it('winner gets the balance updated', async ()=> {
      await lottery.enter({from: accounts[0], value: web3.utils.toWei('2','ether')});
      const initialBal = await web3.eth.getBalance(accounts[0]);
      await lottery.pickWinner();
      const finalBal = await web3.eth.getBalance(accounts[0]);
      const diff = finalBal - initialBal;
      const ether = web3.utils.toWei('1.8','ether');
      assert(diff > ether);
    });

    it('lottery balance gets to 0 once winner announce', async ()=> {
      await lottery.enter({from: accounts[0], value: web3.utils.toWei('2','ether')});
      await lottery.pickWinner();
      const balance = await web3.eth.getBalance(lottery.address);
      assert.equal(balance,0);
    });
  });
});
