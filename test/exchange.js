const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (value) => ethers.utils.parseEther(value.toString());

const fromWei = (value) =>
  ethers.utils.formatEther(
    typeof value === "string" ? value : value.toString()
  );

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const getBalance = ethers.provider.getBalance;


describe("start", function () {
  let owner;
  let user;
  let exchange;

  it("Should deploy contracts", async function () {
    [account1, account2,account3] = await ethers.getSigners();

    const TokenContract = await ethers.getContractFactory("Token");
    const PairContract = await ethers.getContractFactory("ExPair");
    const atoken = await TokenContract.deploy(
      "TokenA",
      "TKNA",
      toWei(1000000)
    );
    await atoken.deployed();
    atokenaddr = atoken.address;

       const btoken = await TokenContract.deploy(
         "TokenB",
         "TKNB",
         toWei(1000000)
       );
       await btoken.deployed();
       btokenaddr = btoken.address;

        console.log("tokenA,tokenB",atokenaddr,btokenaddr)

        const ExchangeContract = await ethers.getContractFactory("Exchange");

        const exchange = await ExchangeContract.deploy();
        await exchange.deployed();
        console.log("exchange address",exchange.address);

        const pair = await exchange.createPair(atokenaddr,btokenaddr);

        console.log(await exchange.pairs(atokenaddr,btokenaddr));

        const pairaddr= await exchange.allPairs(0);

        const Pair= PairContract.attach(pairaddr);

        console.log(await Pair.balanceOf(account1.address))

      const amount = ethers.utils.parseEther("1");

        atoken.approve(exchange.address, amount);
        btoken.approve(exchange.address, amount);

        console.log(account3.address)

         console.log(await Pair.balanceOf(account1.address));

        await exchange.addLiquidity(atokenaddr,btokenaddr,amount,amount,amount,amount,account1.address)

       

        console.log(await Pair.balanceOf(account3.address));

        
        console.log(await Pair.balanceOf(account1.address));











  });


  });


