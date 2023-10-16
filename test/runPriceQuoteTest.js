require("dotenv").config();
let DEBUG_MODE = false;

const { ethers } = require('ethers')
const { TradeType } = require('@uniswap/sdk-core')

const { AlphaRouterServiceDebug } = require('../lib/debug/AlphaRouterServiceDebug')
const { AlphaRouterService, ERC20Services } = require('../lib/prod/AlphaRouterService');
const { UniTokenServices } = require('../lib/prod/uniTokenServices')

const GOERLI_INFURA_TEST_URL = process.env.GOERLI_INFURA_TEST_URL
const CHAIN_ID = parseInt(process.env.GOERLI_CHAIN_ID)
const WALLET_ADDRESS = process.env.WALLET_ADDRESS
const WALLET_SECRET = process.env.WALLET_SECRET

const WETH_ADDRESS = process.env.GOERLI_WETH
const SPCOIN_ADDRESS = process.env.GOERLI_SPCOIN
const UNI_ADDRESS = process.env.GOERLI_UNI

let erc20Services = new ERC20Services(ethers, GOERLI_INFURA_TEST_URL, CHAIN_ID)
// let provider = new ethers.providers.JsonRpcProvider(GOERLI_INFURA_TEST_URL)
let provider = erc20Services.provider
let ARS = DEBUG_MODE ? new AlphaRouterServiceDebug(ethers, CHAIN_ID, provider, erc20Services) : new AlphaRouterService( erc20Services );

getExactInputStrSpCoinToUniQuoteTest = async( _wallet ) => {
    console.log("*** EXECUTING getExactInputStrSpCoinToUniQuoteTest() ******************************");
    let tradeType = TradeType.EXACT_INPUT 
    let tokenInAddr = SPCOIN_ADDRESS;
    let tokenOutAddr = UNI_ADDRESS;
    let slippagePercent = 25;
    let exactInputAmount = '0.01';
    let printDecimals = 12
    let strPriceQuote = await ARS.getStrPriceQuote( tradeType, tokenInAddr, tokenOutAddr, exactInputAmount, slippagePercent, printDecimals)

    let contractIn = erc20Services.getERC20Contract(tokenInAddr)
    let nameIn = await erc20Services.getContractName(contractIn);
    let symbolIn = await erc20Services.getContractSymbol(contractIn);

    let contractOut = erc20Services.getERC20Contract(tokenOutAddr)
    let nameOut = await erc20Services.getContractName(contractOut);
    let symbolOut = await erc20Services.getContractSymbol(contractOut);

    console.log("    Quote Exact Input Amount " + exactInputAmount, nameIn + "(" + symbolIn + ") For " + strPriceQuote, nameOut + "(" + symbolOut + ") tokens")
}

exactOutputSpCoinToUniStrQuoteTest = async( _wallet ) => {
    console.log("*** EXECUTING exactOutputSpCoinToUniStrQuoteTest() ******************************");
    let tradeType = TradeType.EXACT_OUTPUT 
    let tokenInAddr = SPCOIN_ADDRESS;
    let tokenOutAddr = UNI_ADDRESS;
    let slippagePercent = 25;
    let exactOutputAmount = '0.01';
    let printDecimals = 12
    let strPriceQuote = await ARS.getStrPriceQuote( tradeType, tokenInAddr, tokenOutAddr, exactOutputAmount, slippagePercent, printDecimals)
 
    let contractIn = erc20Services.getERC20Contract(tokenInAddr)
    let nameIn = await erc20Services.getContractName(contractIn);
    let symbolIn = await erc20Services.getContractSymbol(contractIn);

    let contractOut = erc20Services.getERC20Contract(tokenOutAddr)
    let nameOut = await erc20Services.getContractName(contractOut);
    let symbolOut = await erc20Services.getContractSymbol(contractOut);

    console.log("    Quote Exact Output Amount " + exactOutputAmount, nameIn + "(" + symbolIn + ") For " + strPriceQuote, nameOut + "(" + symbolOut + ") tokens")
}

exactInputSpCoinToUniQuoteTest = async( _wallet ) => {
    console.log("*** EXECUTING exactInputSpCoinToUniQuoteTest() *****************************");
    let tradeType = TradeType.EXACT_INPUT;
    let tokenInAddr = SPCOIN_ADDRESS;
    let tokenOutAddr = UNI_ADDRESS;
    let exactInputAmount = '0.01';
    let slippagePercent = 25;
    let route = await ARS.getRoute( tradeType, WALLET_ADDRESS, tokenInAddr, tokenOutAddr, exactInputAmount, slippagePercent)
    let quote = route.quote
    let priceQuote = quote.toFixed(10)

    let contractIn = erc20Services.getERC20Contract(tokenInAddr)
    let nameIn = await erc20Services.getContractName(contractIn);
    let symbolIn = await erc20Services.getContractSymbol(contractIn);

    let contractOut = erc20Services.getERC20Contract(tokenOutAddr)
    let nameOut = await erc20Services.getContractName(contractOut);
    let symbolOut = await erc20Services.getContractSymbol(contractOut);

    console.log("    Quote Exact Input Amount " + exactInputAmount, nameIn + "(" + symbolIn + ") For " + priceQuote, nameOut + "(" + symbolOut + ") tokens")
}

exactOutputSpCoinToUniQuoteTest = async( _wallet ) => {
    console.log("*** EXECUTING exactOutputSpCoinToUniQuoteTest() ****************************");
    let tradeType = TradeType.EXACT_OUTPUT;
    let tokenInAddr = SPCOIN_ADDRESS;
    let tokenOutAddr = UNI_ADDRESS;
    let exactOutputAmount = '0.01';
    let slippagePercent = 25;
    let route = await ARS.getRoute( tradeType, WALLET_ADDRESS, tokenInAddr, tokenOutAddr, exactOutputAmount, slippagePercent)
    let quote = route.quote
    let priceQuote = quote.toFixed(10)

    let contractIn = erc20Services.getERC20Contract(tokenInAddr)
    let nameIn = await erc20Services.getContractName(contractIn);
    let symbolIn = await erc20Services.getContractSymbol(contractIn);

    let contractOut = erc20Services.getERC20Contract(tokenOutAddr)
    let nameOut = await erc20Services.getContractName(contractOut);
    let symbolOut = await erc20Services.getContractSymbol(contractOut);

    console.log("    Quote Exact Output Amount " + exactOutputAmount, nameOut + "(" + symbolOut + ") For " + priceQuote, nameIn + "(" + symbolIn + ") tokens")
}

exactInputWethToUniTransTest = async( _wallet ) => {
    console.log("*** EXECUTING exactInputWethToUniTransTest() ********************************");

    let tokenInAddr      = WETH_ADDRESS
    let tokenOutAddr     = UNI_ADDRESS
    let approvalAmount   = ethers.utils.parseUnits('1', 18).toString()
    let exactInputAmount = '0.01'
    let slippagePercent  = 25;
    let gasLimit         = 1000000

    tradeTransaction = await ARS.exeExactInputTransaction(
      WALLET_ADDRESS,
      WALLET_SECRET,
      tokenInAddr,
      tokenOutAddr,
      approvalAmount,
      exactInputAmount,
      slippagePercent,
      gasLimit
    );
    return tradeTransaction;
}

exactOutputWethToUniTransTest = async( _wallet ) => {
    console.log("*** EXECUTING exactOutputWethToUniTransTest() *******************************");

    let tokenInAddr      = WETH_ADDRESS
    let tokenOutAddr     = SPCOIN_ADDRESS
    let approvalAmount   = ethers.utils.parseUnits('1', 18).toString()
    let exactOutputAmount = '0.0000001'
    let slippagePercent  = 25;
    let gasLimit         = 1000000
    
    tradeTransaction = await ARS.exeExactOutputTransaction(
      WALLET_ADDRESS,
      WALLET_SECRET,
      tokenInAddr,
      tokenOutAddr,
      approvalAmount,
      exactOutputAmount,
      slippagePercent,
      gasLimit
    );
    return tradeTransaction;
}

exactInputSpCoinToUniTransTest = async( _wallet ) => {
    console.log("*** EXECUTING exactInputWethToUniTransTest() ********************************");

    let tokenInAddr      = SPCOIN_ADDRESS
    let tokenOutAddr     = UNI_ADDRESS
    let approvalAmount   = ethers.utils.parseUnits('1', 18).toString()
    let exactInputAmount = '0.01'
    let slippagePercent  = 25;
    let gasLimit         = 1000000

    tradeTransaction = await ARS.exeExactInputTransaction(
      WALLET_ADDRESS,
      WALLET_SECRET,
      tokenInAddr,
      tokenOutAddr,
      approvalAmount,
      exactInputAmount,
      slippagePercent,
      gasLimit
    );
    return tradeTransaction;
}

exactOutputSpCoinToUniTransTest = async( _wallet ) => {
    console.log("*** EXECUTING exactOutputWethToUniTransTest() *******************************");

    let tokenInAddr      = UNI_ADDRESS
    let tokenOutAddr     = SPCOIN_ADDRESS
    let approvalAmount   = ethers.utils.parseUnits('1', 18).toString()
    let exactOutputAmount = '0.0000001'
    let slippagePercent  = 25;
    let gasLimit         = 1000000
    
    tradeTransaction = await ARS.exeExactOutputTransaction(
      WALLET_ADDRESS,
      WALLET_SECRET,
      tokenInAddr,
      tokenOutAddr,
      approvalAmount,
      exactOutputAmount,
      slippagePercent,
      gasLimit
    );
    return tradeTransaction;
}

exactInputSpCoinToUniTransTestNew = async( _wallet ) => {
    console.log("*** EXECUTING exactInputSpCoinToUniTransTestNew() ********************************");

    let tokenInAddr      = SPCOIN_ADDRESS
    let tokenOutAddr     = UNI_ADDRESS
    let approvalAmount   = ethers.utils.parseUnits('1', 18).toString()
    let exactInputAmount = '0.01'
    let slippagePercent  = 25;
    let gasLimit         = 1000000

    tradeTransaction = await ARS.exeExactInputTransaction(
      _wallet,
      WALLET_ADDRESS,
      WALLET_SECRET,
      tokenInAddr,
      tokenOutAddr,
      approvalAmount,
      exactInputAmount,
      slippagePercent,
      gasLimit
    );
    return tradeTransaction;
}

main = async( ) => {
    let wallet = erc20Services.wallet(WALLET_SECRET)

    // await getExactInputStrSpCoinToUniQuoteTest(wallet);
    // console.log("---------------------------------------------------------------------------------------");
    // await exactOutputSpCoinToUniStrQuoteTest(wallet);
    // console.log("---------------------------------------------------------------------------------------");
    // await exactInputSpCoinToUniQuoteTest(wallet);
    // console.log("---------------------------------------------------------------------------------------");
    // await exactOutputSpCoinToUniQuoteTest(wallet);
    // console.log("---------------------------------------------------------------------------------------");
    // await exactInputWethToUniTransTest(wallet);
    // console.log("---------------------------------------------------------------------------------------");
    // await exactOutputWethToUniTransTest(wallet);
    // console.log("---------------------------------------------------------------------------------------");
    // await exactInputSpCoinToUniTransTest(wallet);
    // console.log("---------------------------------------------------------------------------------------");
    // await exactOutputSpCoinToUniTransTest(wallet);
    // console.log("---------------------------------------------------------------------------------------");
    await exactInputSpCoinToUniTransTestNew(wallet);
    console.log("---------------------------------------------------------------------------------------");
    console.log("FINISHED EXITING")
}

main()
