require("dotenv").config();
const { abi: QuoterAbi } = require('@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json')
const { abi: Quoter2Abi } = require('@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json')
const { ethers, JsonRpcProvider, parseEther } = require('ethers')

// ----- Addresses -----
// const WETH_ADDRESS = '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'
// const USDC_ADDRESS = '0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C'
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const QUOTER_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
const QUOTER2_ADDRESS = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e'

INFURA_URL="https://mainnet.infura.io/v3/a379b9641c8640d2ac8206b8adcfa060"
provider = new JsonRpcProvider(INFURA_URL);

const tokenIn  = WETH_ADDRESS;
const tokenOut = USDC_ADDRESS;
const fee = '3000';
const amountIn = parseEther('1');
const sqrtPriceLimitX96 = '0';

// const { getSpCoinExchange } = require("./deployHHConnection");

const quoter = {
    QUOTER_ADDRESS,
    QuoterAbi,
    provider
}

const quoter2 = {
    QUOTER2_ADDRESS,
    Quoter2Abi,
    provider            
}

const main = async() => {
    console.log("==============================================================")
    console.log("const amountOut = await quoter.callStatic.quoteExactInputSingle(");
    console.log("   tokenIn:          ", tokenIn);
    console.log("   tokenOut:         ", tokenOut);
    console.log("   fee:              ", fee);
    console.log("   amountIn:         ", amountIn.toString());
    console.log("   sqrtPriceLimitX96:", sqrtPriceLimitX96);
    console.log(")");

    const amountOut = await quoter.callStatic.quoteExactInputSingle(
        tokenIn,
        tokenOut,
        fee,
        amountIn.toString(),
        sqrtPriceLimitX96
    )

    console.log(
        "amountOut",
        ethers.util.formatUnits(amountOut,toString(), 6)
    )

    console.log("==============================================================")

    const params = {
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        fee: fee,
        amountIn: amountIn,
        sqrtPriceLimitX96: sqrtPriceLimitX96
    }

    const output = await quoter2.callStatic.quoteExactInputSingle(
        params
    )

    console.log(
        "amountOut",
        ethers.util.formatUnits(output.amountOut, toString(), 6)
    )

    console.log( "sqrtPriceLimitX96", output.sqrtPriceLimitX96.toString());
    console.log( "initializedTicksCrossed", output.initializedTicksCrossed.toString);
    console.log( "gasEstimated", output.gasEstimated.toString());

    console,log("==============================================================");
}

main()
