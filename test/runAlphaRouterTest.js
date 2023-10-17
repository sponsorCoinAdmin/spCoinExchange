require("dotenv").config();
let DEBUG_MODE = true;

const { ethers } = require('ethers')
const { TradeType } = require('@uniswap/sdk-core')

const { AlphaRouterServiceDebug } = require('../lib/debug/AlphaRouterServiceDebug')
const { AlphaRouterService, ERC20Services } = require('../lib/prod/AlphaRouterService');

const GOERLI_INFURA_TEST_URL = process.env.GOERLI_INFURA_TEST_URL
const CHAIN_ID = parseInt(process.env.GOERLI_CHAIN_ID)
const WALLET_SECRET = process.env.WALLET_SECRET

const WETH_ADDRESS = process.env.GOERLI_WETH
const SPCOIN_ADDRESS = process.env.GOERLI_SPCOIN
const UNI_ADDRESS = process.env.GOERLI_UNI

let erc20Services = new ERC20Services(ethers, GOERLI_INFURA_TEST_URL, CHAIN_ID)
// let provider = new ethers.providers.JsonRpcProvider(GOERLI_INFURA_TEST_URL)
let provider = erc20Services.provider
let ARS = DEBUG_MODE ? new AlphaRouterServiceDebug( erc20Services ) : new AlphaRouterService( erc20Services );

//  NEW CODING

getExactInputTestRoute = async( _wallet ) => {
    console.log("getExactInputTestRoute( wallet:", _wallet.address, ")");

    let recipientAddr   = _wallet.address
    let tradeType        = TradeType.EXACT_INPUT
    let tokenInAddr      = SPCOIN_ADDRESS
    let tokenOutAddr     = UNI_ADDRESS
    let exactInputAmount = '0.01'
    let slippagePercent  = 25;

    let route = await ARS.getRoute(
        recipientAddr,
        tradeType,
        tokenInAddr,
        tokenOutAddr,
        exactInputAmount,
        slippagePercent)

    return route;
}

exactInputSpCoinToUniTransTest = async( walletPvtKey) => {
    console.log("exactOutputWethToUniTransTest( WALLET_SECRET )");

    let wallet = erc20Services.wallet( walletPvtKey )
    let exactInputTestRoute = await getExactInputTestRoute ( wallet )
    let gasLimit         = 1000000

    await ARS.execTransaction(
        wallet,
        exactInputTestRoute,
        gasLimit
    )
}

main = async( ) => {
    await exactInputSpCoinToUniTransTest( WALLET_SECRET )

    console.log("TESTING FINISHED: EXITING")
}

main()
