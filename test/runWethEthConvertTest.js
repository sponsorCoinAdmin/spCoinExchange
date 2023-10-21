require("dotenv").config();

const { ethers, JsonRpcProvider } = require('ethers')
const { ERC20Services, LogERC20Services } = require('../lib/prod/logErc20Services');

const GOERLI_INFURA_TEST_URL = process.env.GOERLI_INFURA_TEST_URL
const CHAIN_ID = parseInt(process.env.GOERLI_CHAIN_ID)
const WALLET_SECRET = process.env.WALLET_SECRET
const WETH_ABI = require('../lib/interfaces/WETH_ABI.json')
const WETH_ADDRESS = process.env.GOERLI_WETH

let erc20Services = new ERC20Services(ethers, GOERLI_INFURA_TEST_URL, CHAIN_ID)
let logErc20Services = new LogERC20Services(ethers, GOERLI_INFURA_TEST_URL, CHAIN_ID)

/*
async function wrapEthTest( _ethAmountInWei ) {
    // Ensure ethAmountInWei is a string
    let ethAmountInWei = "" + _ethAmountInWei
    let provider = new ethers.providers.JsonRpcProvider(GOERLI_INFURA_TEST_URL);
    let wallet = new ethers.Wallet(WALLET_SECRET, provider);
    const wethContract = new ethers.Contract(WETH_ADDRESS, WETH_ABI, wallet);
    const txSigner = wethContract.connect(wallet);

    let tx = txSigner.deposit({value: ethAmountInWei});
    return tx;
  }

depositEthToWeth = async( _ethAmountInWei) => {
    // Ensure ethAmountInWei is a string
    let ethAmountInWei = "" + _ethAmountInWei
    let provider = new ethers.providers.JsonRpcProvider(GOERLI_INFURA_TEST_URL);
    let wallet = new ethers.Wallet(WALLET_SECRET, provider)
    let wethContract = new ethers.Contract(WETH_ADDRESS, WETH_ABI, wallet)
    // console.log(`wethContract = ethers.Contract(${WETH_ADDRESS}, ${WETH_ABI}, ${provider}`)
    await wethContract.connect(wallet).deposit({ value: ethAmountInWei });
}

withdrawEthFromWeth = async (wethContract, _wethAmountInWei) => {
    await wethContract.connect(signer).withdraw( _wethAmountInWei );
}
*/

wrapEthAmtByAddressTest = async(_wallet, _wethAddress, _ethAmount) => {
    logErc20Services.getBalanceOf( _wallet.address, _wethAddress )
    await erc20Services.wrapEthAmtByAddress(_wallet, _wethAddress, _ethAmount)
}

unwrapEthAmtByAddressTest = async(_wallet, _wethAddress, _ethAmount) => {
    logErc20Services.getBalanceOf( _wallet.address, _wethAddress )
    await erc20Services.unwrapEthAmtByAddress(_wallet, _wethAddress, _ethAmount)
}

wrapEthAmtByContractTest = async(_wallet, _wethAddress, _ethAmount) => {
    let wethContract = getContractBalanceOf.getERC20Contract(_wethAddress );
    logErc20Services.getContractBalanceOf( _wallet, _wethAddress )
    await erc20Services.wrapEthAmtByContract(_wallet, wethContract, _ethAmount)
}

unwrapEthAmtByContractTest = async(_wallet, _wethAddress, _ethAmount) => {
    let wethContract = erc20Services.getERC20Contract(_wethAddress );
    logErc20Services.getContractBalanceOf( _wallet, _wethAddress )
    await erc20Services.unwrapEthAmtByContract(_wallet, wethContract, _ethAmount)
}

main = async( ) => {
    // wethToEthByAddressTest(WALLET_SECRET, WETH_ADDRESS, 1)

    let wallet = erc20Services.Wallet(WALLET_SECRET)
    let ethAmount = 0.0123
 
    console.log("------------------------------------------------------------------------------------------------")
    // depositEthToWeth(123456)
    // wrapEthTest(123456)
    // depositEthToWeth(123456)
    // console.log("------------------------------------------------------------------------------------------------")
    // await wrapEthAmtByAddressTest(wallet, WETH_ADDRESS, ethAmount)
    // console.log("------------------------------------------------------------------------------------------------")
    // await unwrapEthAmtByAddressTest(wallet, WETH_ADDRESS, ethAmount)
    // console.log("------------------------------------------------------------------------------------------------")
    await wrapEthAmtByContractTest(wallet, WETH_ADDRESS, ethAmount)
    console.log("------------------------------------------------------------------------------------------------")
    await unwrapEthAmtByContractTest(wallet, WETH_ADDRESS, ethAmount)
    console.log("------------------------------------------------------------------------------------------------")
    console.log("TESTING FINISHED: EXITING")
}

main()
