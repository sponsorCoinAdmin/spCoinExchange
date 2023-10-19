require("dotenv").config();

const { ethers } = require('ethers')
const { ERC20Services, LogERC20Services } = require('../lib/prod/logErc20Services');

const GOERLI_INFURA_TEST_URL = process.env.GOERLI_INFURA_TEST_URL
const CHAIN_ID = parseInt(process.env.GOERLI_CHAIN_ID)
const WALLET_SECRET = process.env.WALLET_SECRET
const WETH_ADDRESS = process.env.GOERLI_WETH

let erc20Services = new ERC20Services(ethers, GOERLI_INFURA_TEST_URL, CHAIN_ID)
let logErc20Services = new LogERC20Services(ethers, GOERLI_INFURA_TEST_URL, CHAIN_ID)

wrapEthAmtByAddressTest = async(_wallet, _wethAddress, _ethAmount) => {
    logErc20Services.getBalanceOf( _walletAddress, _tokenAddress )
    await erc20Services.wrapEthAmtByAddress(_wallet, _wethAddress, _ethAmountInWei)
}

unwrapEthAmtByAddressTest = async(_wallet, _wethAddress, _ethAmount) => {
    logErc20Services.getBalanceOf( _walletAddress, _tokenAddress )
    await erc20Services.unwrapEthAmtByAddress(_wallet, _wethAddress, _wethAmountInWei)
}

wrapEthAmtByContractTest = async(_wallet, _wethAddress, _ethAmount) => {
    let wethContract = getContractBalanceOf.getERC20Contract(_wethAddress );
    logErc20Services.getBalanceOf( _walletAddress, _tokenAddress )
    await erc20Services.wrapEthAmtByContract(_wallet, wethContract, _ethAmountInWei)
}

unwrapEthAmtByContractTest = async(_wallet, _wethAddress, _ethAmount) => {
    let wethContract = erc20Services.getERC20Contract(_wethAddress );
    logErc20Services.getBalanceOf( _walletAddress, _tokenAddress )
    await erc20Services.unwrapEthAmtByContract(_wallet, wethContract, _wethAmountInWei)
}

main = async( ) => {
        // wethToEthByAddressTest(WALLET_SECRET, WETH_ADDRESS, 1)

    let wallet = erc20Services.Wallet(WALLET_SECRET)
    let ethAmount = 0.0123
 
    console.log("------------------------------------------------------------------------------------------------")
    await wrapEthAmtByAddressTest(_wallet, WETH_ADDRESS, ethAmount)
    // console.log("------------------------------------------------------------------------------------------------")
    // await unwrapEthAmtByAddressTest(_wallet, WETH_ADDRESS, ethAmount)
    // console.log("------------------------------------------------------------------------------------------------")
    // await wrapEthAmtByContractTest(_wallet, WETH_ADDRESS, ethAmount)
    // console.log("------------------------------------------------------------------------------------------------")
    // await unwrapEthAmtByContractTest(_wallet, WETH_ADDRESS, ethAmount)
    // console.log("------------------------------------------------------------------------------------------------")
    console.log("TESTING FINISHED: EXITING")
}

main()
