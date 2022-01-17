// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract Lottery{

  address public manager;
  address[] public players;

  constructor() {
    manager = msg.sender;
  }

  function enter() public payable {
    require(msg.value > .01 ether);

    players.push(msg.sender);
    emit EnteredLottery(msg.sender);
  }

  function random() private view returns(uint){
    return uint(sha3(block.difficulty, now, players));
  }

  function pickWinner() public restricted{

    uint index = random() % players.length;
    players[index].transfer(this.balance);
    players = new address[](0);
  }

  modifier restricted(){
    require(msg.sender == manager);
    _;
  }

  function getPlayers() public view returns(address[]){
    return players;
  }

  // Events
  event EnteredLottery(address caller);
}