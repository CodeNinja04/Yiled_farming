// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 ;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract YieldFarming {

 uint256 private reserve0;
 uint256 private reserve1;
 uint256 public liquidity;
 uint256 public totaltime;
 uint256 public totalbalance;
 uint256 public finalbalance;
 address public owner;


constructor() public payable{
    totaltime=block.timestamp;
    owner = msg.sender;
}
 address token0addr=0xd9145CCE52D386f254917e481eB44e9943F39138;//0xDA0bab807633f07f013f94DD0E6A4F96F8742B53;
 address token1addr=0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8;
 address tokenlpaddr =0xf8e81D47203A594245E36C48e151709F0C19fBe8;

  IERC20 token0 = IERC20(token0addr);
  IERC20 token1 = IERC20(token1addr);
  IERC20 tokenlp =IERC20(tokenlpaddr);
  
  uint256 userbalance0 = token0.balanceOf(msg.sender);
  uint256 userbalance1 = token1.balanceOf(msg.sender);

    uint256 amount0=100;
    uint256 amount1=1;

event yield(address,uint256,uint256);

 mapping(address => uint256) public userBalance;
 address[] users;
 mapping(address => uint256) public userfinalBalance;
 mapping(address => bool) public flag;
 mapping(address => uint256) public startTime;


function getbalance0() public view returns(uint256){

    return token0.balanceOf(address(this));
}

function getbalance1() public view returns(uint256){
    return token1.balanceOf(address(this));
}

function contractbalance() public view returns(uint256,uint256){
    return (token0.balanceOf(address(this)),token1.balanceOf(address(this))); 
}

function addr() public view returns(address){
    return address(this);
}

 function getuserBalance() external view returns(uint256,uint256) {
        return (token0.balanceOf(msg.sender),token1.balanceOf(msg.sender));    
    } 


function addLiquidity(uint256 amount) external payable  {

    

    uint256 amt0 = (amount*10**18/amount0);
    uint256 amt1 = (amount*10**18/amount1);
    
    require(token0.balanceOf(msg.sender) >= amt0, "not enough balance in token0");
    require(token1.balanceOf(msg.sender) >= amt1, "not enough balance in token1");

  

    require(token0.approve(address(this),amt0),"tokenA is not approved");
    require(token1.approve(address(this),amt1),"tokenB is not approved");

    token0.transferFrom(payable(msg.sender),address(this),amt0);
    token1.transferFrom(payable(msg.sender),address(this),amt1);

      if(userBalance[msg.sender]!=0){
        users.push(msg.sender);
    }

    reserve0=token0.balanceOf(address(this));
    reserve1=token1.balanceOf(address(this));
    liquidity= reserve0*reserve1;

    if(startTime[msg.sender]==0){

    startTime[msg.sender]=block.timestamp;
    userBalance[msg.sender]+=amt0+amt1;
    totalbalance+=amt0+amt1;

    }

    else{
        totalbalance+=amt0+amt1;
        finalbalance+=userBalance[msg.sender]*( block.timestamp-startTime[msg.sender] );
        userfinalBalance[msg.sender]+=userBalance[msg.sender]*( block.timestamp-startTime[msg.sender] );
        userBalance[msg.sender]+=amt0+amt1;
        startTime[msg.sender]=block.timestamp;
    }


}

function finalBalance() public view returns(uint256){
    return finalbalance;
}

function calculateyield(uint256 x) public payable  {

    //finalbalance+=userBalance[msg.sender]*(block.timestamp-startTime[msg.sender]);
    //totaltime=block.timestamp;
    uint256 coins = (block.timestamp-x)*10**18/86400;
    uint256 dayss = (block.timestamp-x)/86400;

    uint256 usershare = (coins*userfinalBalance[msg.sender])/(finalbalance);
    //emit yield(msg.sender,usershare,totaltime);

    //tokenlp.transfer(msg.sender,usershare);
   
    //return (coins,usershare);
    
    if(dayss!=0) {

        tokenlp.transfer(msg.sender,usershare);
    }

}

// transfer lptokens to this contract and owner sends the tokens to all users
function transfercoins(uint256 x) public payable  {

    require(msg.sender == owner,"you are not owner");
    
    uint256 coins = (block.timestamp-x)*10**18/86400;
    uint256 dayss = (block.timestamp-x)/86400;

    
    if(dayss!=0){
    for (uint i =0 ; i< users.length;i++){

        uint256 usershare = (coins*userfinalBalance[msg.sender])/(finalbalance);

        tokenlp.transfer(msg.sender,usershare);
        userBalance[msg.sender]=0;

    }
    }

}










 receive() external payable {}

 
}