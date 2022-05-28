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
    [account1, account2] = await ethers.getSigners();
    const rewardTokensPerBlock = ethers.utils.parseEther("4");
    const RTokenContract = await ethers.getContractFactory("RewardToken");
    const rtoken = await RTokenContract.deploy(
      "rewardtoken",
      "TKNR",
      toWei(1000000)
    );
    await rtoken.deployed();
    rtokenaddr = rtoken.address;

    console.log("token address", rtokenaddr);

    const LpTokenContract = await ethers.getContractFactory("LpToken");
    const lptoken = await LpTokenContract.deploy(
      "lptoken",
      "TKNLP",
      toWei(1000000)
    );
    await lptoken.deployed();
    lptokenaddr = lptoken.address;

    console.log("lp token", lptokenaddr);

    const FarmContract = await ethers.getContractFactory("farm");
    const farm = await FarmContract.deploy(rtokenaddr, rewardTokensPerBlock);
    await farm.deployed();
    farmaddr = farm.address;
    console.log("farm ", farmaddr);

    console.log(await rtoken.balanceOf(account1.address));
    console.log(await rtoken.balanceOf(account2.address));

    await farm.createPool(rtokenaddr);

    console.log(await farm.pools(0));


     const amount1 = ethers.utils.parseEther("10");
     const amount2 = ethers.utils.parseEther("8");
     await rtoken.approve(farm.address, amount1+amount2);


     await farm.deposit(0, amount1);

      console.log("acc2 balance", await rtoken.balanceOf(account2.address));
      console.log("acc1 balance", await rtoken.balanceOf(account1.address));

     console.log(await farm.pools(0));

     await rtoken.transfer(account2.address, ethers.utils.parseEther("20"));

     console.log("acc2 balance after transfer", await rtoken.balanceOf(account2.address));
     
     rtoken.connect(account2).approve(farm.address, amount2);

     await farm.connect(account2).deposit(0,amount2)

      console.log("acc2 balance", await rtoken.balanceOf(account2.address));
      console.log("acc1 balance", await rtoken.balanceOf(account1.address));

     console.log(await farm.pools(0));

     sleep(2000);

     await farm.connect(account2).harvestRewards(0);
     await farm.harvestRewards(0);


     console.log(await farm.pools(0));

     await farm.connect(account2).withdraw(0);

     console.log("acc2 balance",await rtoken.balanceOf(account2.address));
     console.log("acc1 balance", await rtoken.balanceOf(account1.address));

  });
});
