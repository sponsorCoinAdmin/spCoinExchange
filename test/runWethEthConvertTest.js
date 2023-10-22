require("dotenv").config();

const { ethers } = require('ethers')
const { ERC20Services, DebugErc20Services } = require('../lib/prod/debugErc20Services');

const GOERLI_INFURA_TEST_URL = process.env.GOERLI_INFURA_TEST_URL
const CHAIN_ID = parseInt(process.env.GOERLI_CHAIN_ID)
const WALLET_SECRET = process.env.WALLET_SECRET
const WETH_ABI = require('../lib/interfaces/WETH_ABI.json')
const WETH_ADDRESS = process.env.GOERLI_WETH

let erc20Services = new ERC20Services(ethers, GOERLI_INFURA_TEST_URL, CHAIN_ID)
let debugErc20Services = new DebugErc20Services(ethers, GOERLI_INFURA_TEST_URL, CHAIN_ID)

DEBUG_MODE=true
let DBM = DEBUG_MODE ? debugErc20Services : erc20Services;

async function wrapEthTest( _ethAmountInWei ) {
    let provider = new ethers.providers.JsonRpcProvider(GOERLI_INFURA_TEST_URL);
    let wallet = new ethers.Wallet(WALLET_SECRET, provider);
    const wethContract = new ethers.Contract(WETH_ADDRESS, WETH_ABI, wallet);
    const txSigner = wethContract.connect(wallet);

    let tx = txSigner.deposit({value: ethAmountInWei});
    return tx;
}

wrapEthAmtByAddressTest = async(_wallet, _wethAddress, _ethAmount) => {
    await DBM.wrapEthAmtByAddress(_wallet, _wethAddress, _ethAmount)
}

unwrapEthAmtByAddressTest = async(_wallet, _wethAddress, _ethAmount) => {
    await DBM.unwrapEthAmtByAddress(_wallet, _wethAddress, _ethAmount)
}

wrapEthAmtByContractTest = async(_wallet, _wethAddress, _ethAmount) => {
    let wethContract = DBM.getWETHContract(_wethAddress );
    await DBM.wrapEthAmtByContract(_wallet, wethContract, _ethAmount)
}

unwrapEthAmtByContractTest = async(_wallet, _wethAddress, _ethAmount) => {
    let wethContract = DBM.getWETHContract(_wethAddress );
    await DBM.unwrapEthAmtByContract(_wallet, wethContract, _ethAmount)
}

main = async( ) => {
    let wallet = DBM.Wallet(WALLET_SECRET)
    let ethAmount = 0.0123
    console.log("------------------------------------------------------------------------------------------------")
    await wrapEthAmtByAddressTest(wallet, WETH_ADDRESS, ethAmount)
    console.log("------------------------------------------------------------------------------------------------")
    await unwrapEthAmtByAddressTest(wallet, WETH_ADDRESS, ethAmount)
    console.log("------------------------------------------------------------------------------------------------")
    await wrapEthAmtByContractTest(wallet, WETH_ADDRESS, ethAmount)
    console.log("------------------------------------------------------------------------------------------------")
    await unwrapEthAmtByContractTest(wallet, WETH_ADDRESS, ethAmount)
    console.log("------------------------------------------------------------------------------------------------")
    console.log("TESTING FINISHED: EXITING")
}

main()
