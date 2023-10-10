require("dotenv").config();
let DEBUG_MODE = false;

const { ethers } = require('ethers')
const { AlphaRouterServiceDebug } = require('./AlphaRouterServiceDebug')
const { AlphaRouterService } = require('./AlphaRouterService');
const { UniTokenServices } = require('./uniTokenServices')

const INFURA_TEST_URL = process.env.GOERLI_INFURA_TEST_URL
const CHAIN_ID = parseInt(process.env.GOERLI_CHAIN_ID)
const WALLET_ADDRESS = process.env.WALLET_ADDRESS
const WALLET_SECRET = process.env.WALLET_SECRET

const provider = new ethers.providers.JsonRpcProvider(INFURA_TEST_URL) // Ropsten

const WETH_ADDRESS   = process.env.GOERLI_WETH
const SPCOIN_ADDRESS = process.env.GOERLI_SPCOIN
const UNI_ADDRESS    = process.env.GOERLI_UNI

let ARS = DEBUG_MODE ? new AlphaRouterServiceDebug(ethers, CHAIN_ID, provider) : new AlphaRouterService();

//////////////////////////////////////////////////////////////////////////////////////////////

async function main( ) {

  const inputTokenAmount = '0.01'
  // const wei = ethers.utils.parseUnits(inputTokenAmount, 18)
  // const inputTokenAmountInWei = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei))
  let approvalAmount  = ethers.utils.parseUnits('1', 18).toString()
  let slippagePercent = 25;
  let gasLimit        = 1000000
  
  await ARS.exeExactInputTransaction(
    WALLET_ADDRESS,
    WALLET_SECRET,
    WETH_ADDRESS,
    UNI_ADDRESS,
    approvalAmount,
    inputTokenAmount,
    slippagePercent,
    gasLimit
  );

}

main()
