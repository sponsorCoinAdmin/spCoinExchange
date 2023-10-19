require("dotenv").config();
let DEBUG_MODE = true;

const { ethers } = require('ethers')
const { AlphaRouterServiceDebug } = require('../lib/debug/AlphaRouterServiceDebug')
const { AlphaRouterService, ERC20Services } = require('../lib/prod/AlphaRouterService');

const GOERLI_INFURA_TEST_URL = process.env.GOERLI_INFURA_TEST_URL
const CHAIN_ID = parseInt(process.env.GOERLI_CHAIN_ID)
const WALLET_SECRET = process.env.WALLET_SECRET
const WETH_ADDRESS = process.env.GOERLI_WETH
const UNI_ADDRESS = process.env.GOERLI_UNI

let erc20Services = new ERC20Services(ethers, GOERLI_INFURA_TEST_URL, CHAIN_ID)
// let provider = new ethers.providers.JsonRpcProvider(GOERLI_INFURA_TEST_URL)
// let provider = erc20Services.provider
let ARS = DEBUG_MODE ? new AlphaRouterServiceDebug( erc20Services ) : new AlphaRouterService( erc20Services );

tokenAmountToWeiTest = ( _amount, _decimals ) => {
    let wei = erc20Services.tokenAmtToBigint( _amount, _decimals )
    console.log(`tokenAmountToWeiTest: ${_amount} token(s) with ${_decimals} decimals equals ${ wei.toString()} bigInt(s)`);
}

tokenAddrToBigIntAmtTest = async( _tokenAddress, _amount ) => {
    let wei = await erc20Services.tokenAddrToBigintAmt( _tokenAddress, _amount )
    let tokenContract = erc20Services.getERC20Contract( _tokenAddress );
    let tokenName = await tokenContract.name()
    console.log(`tokenAddrToBigIntAmtTest: ${_amount} ${tokenName} token(s) equals ${ wei.toString()} bigInt(s)`);
}

tokenContractAmtToBigIntTest = async( _tokenAddress, _amount ) => {
    let tokenContract = erc20Services.getERC20Contract( _tokenAddress );
    let tokenName = await tokenContract.name()
    let wei = await erc20Services.tokenContractAmtToBigInt( tokenContract, _amount )
    console.log(`tokenContractAmtToBigIntTest: ${_amount} ${tokenName} token(s) equals ${ wei.toString()} bigInt(s)`);
}

bigIntToTokenAmtTest = async( _weiAmount, _decimals ) => {
    let tokenAmt = erc20Services.bigIntToTokenAmt( _weiAmount, _decimals )
    console.log(`bigIntToTokenAmtTest: ${_weiAmount} bigInt(s) equals ${ tokenAmt} token(s)`);
}

bigIntToTokenAddrAmtTest = async( _tokenAddress, _amount ) => {
    let tokenContract = erc20Services.getERC20Contract( _tokenAddress );
    let tokenName = await tokenContract.name()
    let tokenAmt = await erc20Services.bigIntToTokenAddrAmt( _tokenAddress, _amount )
    console.log(`bigIntToTokenContractAmtTest: ${_amount} bigInt(s) equals ${ tokenAmt.toString()} ${tokenName} token(s)`);
}

bigIntToTokenContractAmtTest = async( _tokenAddress, _amount ) => {
    let tokenContract = erc20Services.getERC20Contract( _tokenAddress );
    let tokenName = await tokenContract.name()
    let tokenAmt = await erc20Services.bigIntToTokenContractAmt( tokenContract, _amount )
    console.log(`bigIntToTokenContractAmtTest: ${_amount} bigInt(s) equals ${ tokenAmt.toString()} ${tokenName} token(s)`);
}

main = async( ) => {
    // wethToEthByAddressTest(WALLET_SECRET, WETH_ADDRESS, 1)
    // wallet = erc20Services.Wallet(WALLET_SECRET)
    console.log("------------------------------------------------------------------------------------------------")
    tokenAmountToWeiTest( 1, 18 )
    console.log("------------------------------------------------------------------------------------------------")
    await tokenAddrToBigIntAmtTest(WETH_ADDRESS, 1)
    console.log("------------------------------------------------------------------------------------------------")
    await tokenContractAmtToBigIntTest(WETH_ADDRESS, "1") 
    console.log("------------------------------------------------------------------------------------------------")
    await bigIntToTokenAddrAmtTest(WETH_ADDRESS , 456)
    console.log("------------------------------------------------------------------------------------------------")
    await bigIntToTokenContractAmtTest(WETH_ADDRESS , 123)
    console.log("------------------------------------------------------------------------------------------------")
    bigIntToTokenAmtTest("12345678901234567890123456789",6)
    console.log("------------------------------------------------------------------------------------------------")
    console.log("TESTING FINISHED: EXITING")
}

main()
