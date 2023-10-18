require("dotenv").config();

const { AlphaRouterService, UniTokenServices } = require('../prod/AlphaRouterService')
const { TradeType } = require('@uniswap/sdk-core')

let UTS
let erc20Services

class AlphaRouterServiceDebug {
    constructor(_erc20Services) {
    erc20Services = _erc20Services
    UTS = new UniTokenServices(erc20Services)

    this.ARS = new AlphaRouterService(erc20Services)
    console.log( "DEBUG MODE ON: AlphaRouterServiceDebug");
  }

  getExactInputStrPriceQuote = async(_tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, _decimals) => {
    return getStrPriceQuote( TradeType.EXACT_INPUT, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, _decimals)
  }

  getExactOutputStrPriceQuote = async(_tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, _decimals) => {
    return getStrPriceQuote( TradeType.EXACT_OUTPUT, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, _decimals)
  }

  getStrPriceQuote = async( _tradeType, _tokenAddrIn, _tokenAddrOut, _tokenAmount, _slippagePercent, decimals) => {
    console.log( " EXECUTING getStrPriceQuote(",  _tradeType, _tokenAddrIn, _tokenAddrOut, _tokenAmount, _slippagePercent, decimals, ")" );
    let result = await this.ARS.getStrPriceQuote(_tradeType, _tokenAddrIn, _tokenAddrOut, _tokenAmount, _slippagePercent, decimals)
    await UTS.dumpTokenDetailsByAddress(_tokenAddrIn);
    await UTS.dumpTokenDetailsByAddress(_tokenAddrOut);

    // console.log("tokenAddrIn balanceOf:", (await erc20Services.getBalanceOf(_tokenAddrIn, WALLET_ADDRESS)));
    // console.log("tokenAddrIn balanceOf:", (await erc20Services.getBalanceOf(_tokenAddrOut, WALLET_ADDRESS)))));
    // console.log("strPriceQuote:", await erc20Services.getName(_tokenAddrOut), "(", result, ")");
    return result;
  }

  getExactOutputPriceQuote = async( _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent) => {
    return getPriceQuote( TradeType.EXACT_OUTPUT, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent)
  }

  getExactInputPriceQuote = async( _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent) => {
    return getPriceQuote( TradeType.EXACT_INPUT, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent)
  }

  getPriceQuote = async( _tradeType, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent) => {
    console.log( " EXECUTING getPriceQuote(", _tradeType, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, ")" );
    let result = await this.ARS.getPriceQuote( _tradeType, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent)
    // console.log( "getPriceQuote result:", result);
    return result;
  }
  
  getExactInputRoute = async(_recipientAddr, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent) => {
    return await getRoute(_recipientAddr, TradeType.EXACT_INPUT, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent)
  }

  getExactOutputRoute = async(_recipientAddr, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent) => {
    return await getRoute(_recipientAddr, TradeType.EXACT_OUTPUT, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent)
  }

  getRoute = async(_recipientAddr, _tradeType, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent) => {
    console.log( " EXECUTING getRoute(", _recipientAddr, _tradeType, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent, ")" );
    let result = await this.ARS.getRoute( _recipientAddr, _tradeType, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent );
    return result;
  }
      
  getTransaction = ( _route, _walletAddress, _gasLimit ) => {
    console.log( " EXECUTING getTransaction(", _route, _walletAddress, _gasLimit, ")" );
    let result = this.ARS.getTransaction = ( _route, _walletAddress, _gasLimit )
    console.log( "getTransaction result:", result);
    return result;
  }
  

  exeExactInputTransaction = async(
    _wallet,
    _tokenInAddr,
    _tokenOutAddr,
    _approvalAmount,
    _exactInputAmount,
    _slippagePercent,
    _gasLimit) => {
      console.log( " EXECUTING exeExactInputTransaction(", 
      _wallet.address,
      _tokenInAddr,
      _tokenOutAddr,
      _approvalAmount,
      _exactInputAmount,
      _slippagePercent,
      _gasLimit, ")" );

      await this.execTransactionRoute(
        _wallet,
        TradeType.EXACT_INPUT,
        _tokenInAddr,
        _tokenOutAddr,
        _approvalAmount,
        _exactInputAmount,
        _slippagePercent,
        _gasLimit)
  }

  exeExactOutputTransaction = async(
    _wallet,
    _tokenInAddr,
    _tokenOutAddr,
    _approvalAmount,
    _exactOutputAmount,
    _slippagePercent,
    _gasLimit) => {
console.log( " EXECUTING exeExactOutputTransaction(", 
_wallet.address,
_tokenInAddr,
_tokenOutAddr,
_approvalAmount,
_exactOutputAmount,
_slippagePercent,
_gasLimit, ")" );

await this.execTransactionRoute(
  _wallet,
  TradeType.EXACT_OUTPUT,
  _tokenInAddr,
  _tokenOutAddr,
  _approvalAmount,
  _exactOutputAmount,
  _slippagePercent,
  _gasLimit)
}

exeTransaction = async(
_walletAddress,
_walletPvtKey,
_tokenIn,
_tokenOut,
_inputAmount,
_slippagePercent,
_gasLimit) => {
  console.log( " EXECUTING exeTransaction(", _walletAddress,
  _walletPvtKey,
  _tokenIn,
  _tokenOut,
  _inputAmount,
  _slippagePercent,
  _gasLimit, ")" );
  let result = await this.ARS.exeTransaction(
    _walletAddress,
    _walletPvtKey,
    _tokenIn,
    _tokenOut,
    _inputAmount,
    _slippagePercent,
    _gasLimit)
  console.log( "exeTransaction result:", result);
  return result;
}

execTransactionRoute = async(
      _wallet,
      _tradeType,
      _tokenInAddr,
      _tokenOutAddr,
      _approvalAmount,
      _exactAmount,
      _slippagePercent,
      _gasLimit) => {
  console.log( " EXECUTING execTransactionRoute(", 
  _wallet.address,
  _tokenInAddr,
  _tokenOutAddr,
  _approvalAmount,
  _exactAmount,
  _slippagePercent,
  _gasLimit, ")" );

  let walletAddress = _wallet.address
  let route = await this.getRoute( walletAddress, _tradeType, _tokenInAddr, _tokenOutAddr, _exactAmount, _slippagePercent);
  let quote = route.quote;

  let tokenInContract  = erc20Services.getERC20Contract(_tokenInAddr)
  let tokenOutContract = UTS.getERC20Contract(_tokenOutAddr)
  let tokenInName      = await tokenInContract.name();
  let tokenOutName     = await tokenOutContract.name();

  let tokenInBeforeBalance  = await tokenInContract.balanceOf(walletAddress);
  let tokenOutBeforeBalance = await tokenOutContract.balanceOf(walletAddress);
  console.log(tokenInName, "tokenInBeforeBalance", tokenInBeforeBalance.toString())
  console.log(tokenOutName, "tokenOutBeforeBalance", tokenOutBeforeBalance.toString())

  tokenOutContract.balanceOf(walletAddress);
  console.log("Swapping:", _exactAmount, tokenInName, "For",  quote.toFixed(10), tokenOutName)

  await this.execTransaction(
    _wallet,
    route,
    _gasLimit)

    let tokenInAfterBalance = await tokenInContract.balanceOf(walletAddress);
    let tokenOutAfterBalance = await tokenOutContract.balanceOf(walletAddress);
    let diffInDecimals  = await tokenInContract.decimals();
    let diffOutDecimals = await tokenOutContract.decimals();
    console.log(tokenInName, "tokenInAfterBalance", tokenInAfterBalance.toString())
    console.log(tokenOutName, "tokenOutAfterBalance", tokenOutAfterBalance.toString())
    let diffInBalance = (tokenInAfterBalance - tokenInBeforeBalance)/(10**diffInDecimals)
    let diffOutBalance = (tokenOutAfterBalance - tokenOutBeforeBalance)/(10**diffOutDecimals)
    let ratio = -diffOutBalance/diffInBalance

    let diffInStrBalance = diffInBalance.toFixed(5)
    let diffOutStrBalance = diffOutBalance.toFixed(10)

    console.log("Swapped:", diffInStrBalance, tokenInName, "For",  diffOutStrBalance, tokenOutName)
    console.log("Ratio: 1", tokenInName, "=",  ratio, tokenOutName)
  }

  execTransaction = async(
    _wallet,
    _route,
    _gasLimit ) => {

      console.log( "execTransaction = async(" )
      console.log("       _wallet.address:", _wallet.address )
      console.log("       _route.quote   :", _route.quote.toFixed(18) )
      console.log("       _gasLimit      :", _gasLimit )
      console.log("    )" )

      await this.ARS.execTransaction(
        _wallet,
        _route,
        _gasLimit);
    }
}

module.exports = {
  AlphaRouterServiceDebug
}
