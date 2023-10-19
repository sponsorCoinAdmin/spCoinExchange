require("dotenv").config();
let DEBUG_MODE = true;

const { ethers } = require('ethers')
const { AlphaRouterServiceDebug } = require('../lib/debug/AlphaRouterServiceDebug')
const { AlphaRouterService, ERC20Services } = require('../lib/prod/AlphaRouterService');
const { Token : UniToken, CurrencyAmount } = require('@uniswap/sdk-core')


const GOERLI_INFURA_TEST_URL = process.env.GOERLI_INFURA_TEST_URL
const CHAIN_ID = parseInt(process.env.GOERLI_CHAIN_ID)
const WALLET_SECRET = process.env.WALLET_SECRET
const WETH_ADDRESS = process.env.GOERLI_WETH
const UNI_ADDRESS = process.env.GOERLI_UNI

let erc20Services = new ERC20Services(ethers, GOERLI_INFURA_TEST_URL, CHAIN_ID)
// let provider = new ethers.providers.JsonRpcProvider(GOERLI_INFURA_TEST_URL)
// let provider = erc20Services.provider
let ARS = DEBUG_MODE ? new AlphaRouterServiceDebug( erc20Services ) : new AlphaRouterService( erc20Services );

tokenAmountToWeiTest = ( _number, _decimals ) => {
    let wei = erc20Services.tokenToBigIntAmt( _number, _decimals )
    console.log(`tokenAmountToWeiTest: ${_number} token(s) equals ${ wei.toString()} wei`);
}

tokenAddressToWeiTest = async( _tokenAddress, _amount ) => {
    let wei = await erc20Services.tokenAddrToBigintAmt( _tokenAddress, _amount )
    let tokenContract = erc20Services.getERC20Contract( _tokenAddress );
    let tokenName = await tokenContract.name()
    console.log(`tokenAddressToWeiTest: ${_amount} ${tokenName} token(s) equals ${ wei.toString()} wei`);
}

tokenContractToWeiTest = async( _tokenAddress, _amount ) => {
    let tokenContract = erc20Services.getERC20Contract( _tokenAddress );
    let tokenName = await tokenContract.name()
    let wei = await erc20Services.tokenContractAmtToBigInt( tokenContract, _amount )
    console.log(`tokenContractToWeiTest: ${_amount} ${tokenName} token(s) equals ${ wei.toString()} wei`);
}

wethToEthByAddressTest = async( _wallerAddr, _wethAddr, _wethAmountInWei ) => {
    console.log("wethToEthByAddressTest( )");
    let wallet            = erc20Services.wallet( _wallerAddr )
    let wethAddr          = WETH_ADDRESS
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
        // wethToEthByAddressTest(WALLET_SECRET, WETH_ADDRESS, 1)

    wallet = erc20Services.Wallet(WALLET_SECRET)
 
    tokenAmountToWeiTest( 1, 5 )
    console.log("------------------------------------------------------------------------------------------------")
    await tokenAddressToWeiTest(WETH_ADDRESS, 1)
    console.log("------------------------------------------------------------------------------------------------")
    await tokenContractToWeiTest(WETH_ADDRESS, 1)

    // let wei = ethers.utils.parseUnits("" + 10, decimals)
    // console.log("wei:",wei.toString());

    // return CurrencyAmount.fromRawAmount(uniToken, JSBI.BigInt(wei))    
    
    console.log("------------------------------------------------------------------------------------------------")
    console.log("TESTING FINISHED: EXITING")
}

main()
