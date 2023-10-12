require("dotenv").config();
let DEBUG_MODE = false;

const { ethers } = require('ethers')
const { AlphaRouterServiceDebug } = require('./lib/debug/AlphaRouterServiceDebug')

const { AlphaRouterService, UniTokenServices } = require('./lib/prod/AlphaRouterService');
// const { UniTokenServices } = require('./uniTokenServices')
const { TradeType } = require('@uniswap/sdk-core')

const INFURA_TEST_URL = process.env.GOERLI_INFURA_TEST_URL
const CHAIN_ID = parseInt(process.env.GOERLI_CHAIN_ID)
const WALLET_ADDRESS = process.env.WALLET_ADDRESS
const WALLET_SECRET = process.env.WALLET_SECRET

const provider = new ethers.providers.JsonRpcProvider(INFURA_TEST_URL) // Ropsten

const WETH_ADDRESS = process.env.GOERLI_WETH
const SPCOIN_ADDRESS = process.env.GOERLI_SPCOIN
const UNI_ADDRESS = process.env.GOERLI_UNI

let ARS = DEBUG_MODE ? new AlphaRouterServiceDebug(ethers, CHAIN_ID, provider) : new AlphaRouterService();
let UTS = new UniTokenServices(ethers, CHAIN_ID, provider)

getExactInputStrQuoteTest = async( ) => {
    console.log("*** EXECUTING getExactInputStrQuoteTest() ******************************");
    let tradeType = TradeType.EXACT_INPUT 
    let tokenInAddr = SPCOIN_ADDRESS;
    let tokenOutAddr = UNI_ADDRESS;
    let slippagePercent = 25;
    let tokenAmountIn = '0.01';
    let printDecimals = 12
    strPriceQuote = await ARS.getStrPriceQuote( tradeType, tokenInAddr, tokenOutAddr, tokenAmountIn, slippagePercent, printDecimals)
    console.log("*** getExactInputStrQuoteTest with Fees:", strPriceQuote);
}

getExactOutputStrQuoteTest = async( ) => {
    console.log("*** EXECUTING getExactOutputStrQuoteTest() ******************************");
    let tradeType = TradeType.EXACT_OUTPUT 
    let tokenInAddr = SPCOIN_ADDRESS;
    let tokenOutAddr = UNI_ADDRESS;
    let slippagePercent = 25;
    let tokenAmountIn = '0.01';
    let printDecimals = 12
    strPriceQuote = await ARS.getStrPriceQuote( tradeType, tokenInAddr, tokenOutAddr, tokenAmountIn, slippagePercent, printDecimals)
    console.log("*** getExactOutputStrQuoteTest with Fees:", strPriceQuote);
}

getExactInputRouteQuoteTest = async( ) => {
    let tradeType = TradeType.EXACT_INPUT;
    let tokenInAddr = SPCOIN_ADDRESS;
    let tokenOutAddr = UNI_ADDRESS;
    let tokenAmountInWei = 100;
    let slippagePercent = 25;
    let printDecimals = 12
    let route = await ARS.getStrPriceQuote( tradeType, tokenInAddr, tokenOutAddr, tokenAmountInWei, slippagePercent, printDecimals)
    let quote = route.quote
    // console.log("getExactInputRouteQuoteTest SPCOIN to WETH:", quote.toFixed(10))
}

getExactOutputRouteQuoteTest = async( ) => {
    let tradeType = TradeType.EXACT_OUTPUT;
    let tokenInAddr = SPCOIN_ADDRESS;
    let tokenOutAddr = UNI_ADDRESS;
    let tokenAmountIn = '0.01';
    let slippagePercent = 25;
    let route = await ARS.getRoute( tradeType, WALLET_ADDRESS, tokenInAddr, tokenOutAddr, tokenAmountIn, slippagePercent)
    let quote = route.quote
    console.log("getExactOutputRouteQuoteTest SPCOIN to WETH:", quote.toFixed(10))
}

exeExactInputTransactionTest = async( ) => {
    console.log("*** EXECUTING exeExactInputTransactionTest() ********************************");

    let tokenInAddr      = WETH_ADDRESS
    let tokenOutAddr     = UNI_ADDRESS
    let approvalAmount   = ethers.utils.parseUnits('1', 18).toString()
    let inputTokenAmount = '0.01'
    let slippagePercent  = 25;
    let gasLimit         = 1000000

    /*
    let tokenInContract  = UTS.getERC20Contract(tokenInAddr)
    let tokenOutContract = UTS.getERC20Contract(tokenOutAddr)
    tokenInName          = await tokenInContract.name();
    tokenOutName         = await tokenOutContract.name();

    console.log("Swapping" )"
    */   
    tradeTransaction = await ARS.exeExactInputTransaction(
      WALLET_ADDRESS,
      WALLET_SECRET,
      tokenInAddr,
      tokenOutAddr,
      approvalAmount,
      inputTokenAmount,
      slippagePercent,
      gasLimit
    );
    return tradeTransaction;
}

exeExactOutputTransactionTest = async( ) => {
    console.log("*** EXECUTING exeExactOutputTransactionTest() *******************************");

    let tokenInAddr      = WETH_ADDRESS
    let tokenOutAddr     = SPCOIN_ADDRESS
    let approvalAmount   = ethers.utils.parseUnits('1', 18).toString()
    let inputTokenAmount = '0.01'
    let slippagePercent  = 25;
    let gasLimit         = 1000000
    
    tradeTransaction = await ARS.exeExactOutputTransaction(
      WALLET_ADDRESS,
      WALLET_SECRET,
      tokenInAddr,
      tokenOutAddr,
      approvalAmount,
      inputTokenAmount,
      slippagePercent,
      gasLimit
    );
    return tradeTransaction;
}

main = async( ) => {
    await getExactInputStrQuoteTest();
    await getExactOutputStrQuoteTest();
    console.log("*** EXECUTING getExactInputRouteQuoteTest() *****************************");
    await getExactInputRouteQuoteTest();
    console.log("*** EXECUTING getExactOutputRouteQuoteTest() *****************************");
    await getExactInputRouteQuoteTest();
    await exeExactInputTransactionTest();
    console.log("FINISHED EXITING")
}

main()
