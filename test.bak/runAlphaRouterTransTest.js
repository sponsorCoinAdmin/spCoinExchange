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
// let provider = erc20Services.provider
let ARS = DEBUG_MODE ? new AlphaRouterServiceDebug( erc20Services ) : new AlphaRouterService( erc20Services );

//  NEW CODING

execTransaction = async(wallet, exactInputTestRoute, gasLimit ) => {
    await ARS.execTransaction(
        wallet,
        exactInputTestRoute,
        gasLimit
    )
}

getExactInputTestRoute = async( _wallet,
                                _tokenInAddr,
                                _tokenOutAddr,
                                _exactInputAmount,
                                _slippagePercent,
                                _gasLimit ) => {

    let route = await getTestRoute( _wallet,
                                    TradeType.EXACT_INPUT,
                                    _tokenInAddr,
                                    _tokenOutAddr,
                                    _exactInputAmount,
                                    _slippagePercent,
                                    _gasLimit
                                )
    return route;
}

getExactOutputTestRoute = async( _wallet,
                                _tokenInAddr,
                                _tokenOutAddr,
                                _exactOutputAmount,
                                _slippagePercent,
                                _gasLimit ) => {

let route = await getTestRoute( _wallet,
                                TradeType.EXACT_OUTPUT,
                                _tokenInAddr,
                                _tokenOutAddr,
                                _exactOutputAmount,
                                _slippagePercent,
                                _gasLimit
                            )
    return route;
}


getTestRoute = async( 
    _wallet,
    _tradeType,
    _tokenInAddr,
    _tokenOutAddr,
    _exactAmount,
    _slippagePercent,
    _gasLimit ) => {
        console.log("getTestRoute( wallet           :", _wallet.address );
        console.log("              _tradeType       :", _tradeType == TradeType.EXACT_INPUT ? "EXACT_INPUT" : "EXACT_OUTPUT");
        console.log("              _tokenInAddr     :", await erc20Services.getAddressNameSymbol(_tokenInAddr));
        console.log("              _tokenOutAddr    :", await erc20Services.getAddressNameSymbol(_tokenOutAddr));
        console.log("              _exactAmount     :", _exactAmount );
        console.log("              _slippagePercent :", _slippagePercent );
        console.log("              _gasLimit        :", _gasLimit );
        console.log("            )");

        let route = await ARS.getRoute( _wallet.address,
                _tradeType,
                _tokenInAddr,
                _tokenOutAddr,
                _exactAmount,
                _slippagePercent
            )
        console.log("Calculated route.quote:", route.quote.toFixed(18))
        return route;
}

exactInputSpCoinToUniTransTest = async( ) => {
    console.log("exactInputWethToUniTransTest( )");
    let wallet           = erc20Services.wallet( WALLET_SECRET )
    let tokenInAddr      = SPCOIN_ADDRESS
    let tokenOutAddr     = UNI_ADDRESS
    let exactInputAmount = '1'
    let slippagePercent  = 25;
    let gasLimit         = 1000000
    console.log("SWAPPING", exactInputAmount, await erc20Services.getNameSymbol(tokenInAddr), "For", await erc20Services.getNameSymbol(tokenOutAddr));

    let exactInputTestRoute = await getExactInputTestRoute ( 
                                        wallet,
                                        tokenInAddr,
                                        tokenOutAddr,
                                        exactInputAmount,
                                        slippagePercent,
                                        gasLimit
                                    )
    await execTransaction(
        wallet,
        exactInputTestRoute,
        gasLimit
    )
}

exactOutputSpCoinToUniTransTest = async( ) => {
    console.log("exactOutputWethToUniTransTest( )");
    let wallet            = erc20Services.wallet( WALLET_SECRET )
    let tokenInAddr       = SPCOIN_ADDRESS
    let tokenOutAddr      = UNI_ADDRESS
    let exactOutputAmount = '1'
    let slippagePercent   = 25;
    let gasLimit          = 1000000
    console.log("SWAPPING", exactOutputAmount, await erc20Services.getNameSymbol(tokenInAddr), "For", await erc20Services.getNameSymbol(tokenOutAddr));

    let exactOutputTestRoute = await getExactOutputTestRoute ( 
                                        wallet,
                                        tokenInAddr,
                                        tokenOutAddr,
                                        exactOutputAmount,
                                        slippagePercent,
                                        gasLimit
                                    )
    await execTransaction(
        wallet,
        exactOutputTestRoute,
        gasLimit
    )
}

///////////////////////////////////////////////////////////////////////////////////
exactInputWethToUniTransTest = async( ) => {
    console.log("exactInputWethToUniTransTest( )");
    let wallet           = erc20Services.wallet( WALLET_SECRET )
    let tokenInAddr      = WETH_ADDRESS
    let tokenOutAddr     = UNI_ADDRESS
    let exactInputAmount = '0.001'
    let slippagePercent  = 25;
    let gasLimit         = 1000000
    console.log("SWAPPING", exactInputAmount, await erc20Services.getNameSymbol(tokenInAddr), "For", await erc20Services.getNameSymbol(tokenOutAddr));

    let exactInputTestRoute = await getExactInputTestRoute ( 
                                        wallet,
                                        tokenInAddr,
                                        tokenOutAddr,
                                        exactInputAmount,
                                        slippagePercent,
                                        gasLimit
                                    )
    await execTransaction(
        wallet,
        exactInputTestRoute,
        gasLimit
    )
}

exactOutputWethToUniTransTest = async( ) => {
    console.log("exactOutputWethToUniTransTest( )");
    let wallet            = erc20Services.wallet( WALLET_SECRET )
    let tokenInAddr       = WETH_ADDRESS
    let tokenOutAddr      = UNI_ADDRESS
    let exactOutputAmount = '0.001'
    let slippagePercent   = 25;
    let gasLimit          = 1000000
    console.log("SWAPPING", exactOutputAmount, await erc20Services.getNameSymbol(tokenInAddr), "For", await erc20Services.getNameSymbol(tokenOutAddr));

    let exactOutputTestRoute = await getExactInputTestRoute ( 
                                        wallet,
                                        tokenInAddr,
                                        tokenOutAddr,
                                        exactOutputAmount,
                                        slippagePercent,
                                        gasLimit
                                    )
    await execTransaction(
        wallet,
        exactOutputTestRoute,
        gasLimit
    )
}

main = async( ) => {
    await exactInputSpCoinToUniTransTest( )
    console.log("------------------------------------------------------------------------------------------------")
    await exactOutputSpCoinToUniTransTest( )
    console.log("------------------------------------------------------------------------------------------------")
    await exactInputWethToUniTransTest( )
    console.log("------------------------------------------------------------------------------------------------")
    await exactOutputWethToUniTransTest( )
    console.log("------------------------------------------------------------------------------------------------")

    console.log("TESTING FINISHED: EXITING")
}

main()
