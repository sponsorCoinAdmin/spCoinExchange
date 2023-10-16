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

      let walletAddress = _wallet.address
      let tradeType = TradeType.EXACT_INPUT;
      let route = await this.getRoute( walletAddress, tradeType, _tokenInAddr, _tokenOutAddr, _exactInputAmount, _slippagePercent);
      let quote = route.quote;

      let tokenInContract  = erc20Services.getERC20Contract(_tokenInAddr)
      let tokenOutContract = UTS.getERC20Contract(_tokenOutAddr)
      let tokenInName      = await tokenInContract.name();
      let tokenOutName     = await tokenOutContract.name();

      let tokenInBeforeBalance  = await tokenInContract.balanceOf(walletAddress);
      let tokenOutBeforeBalance = await tokenOutContract.balanceOf(walletAddress);
      // console.log(tokenInName, "tokenInBeforeBalance", tokenInBeforeBalance.toString())
      // console.log(tokenOutName, "tokenOutBeforeBalance", tokenOutBeforeBalance.toString())

      tokenOutContract.balanceOf(walletAddress);
      console.log("Swapping:", _exactInputAmount, tokenInName, "For",  quote.toFixed(10), tokenOutName)

      await this.ARS.exeExactInputTransaction(
        _wallet,
        _tokenInAddr,
        _tokenOutAddr,
        _approvalAmount,
        _exactInputAmount,
        _slippagePercent,
        _gasLimit)

        let tokenInAfterBalance = await tokenInContract.balanceOf(walletAddress);
        let tokenOutAfterBalance = await tokenOutContract.balanceOf(walletAddress);
        let diffInDecimals  = await tokenInContract.decimals();
        let diffOutDecimals = await tokenOutContract.decimals();
        // console.log(tokenInName, "tokenInAfterBalance", tokenInAfterBalance.toString())
        // console.log(tokenOutName, "tokenOutAfterBalance", tokenOutAfterBalance.toString())
        let diffInBalance = (tokenInAfterBalance - tokenInBeforeBalance)/(10**diffInDecimals)
        let diffOutBalance = (tokenOutAfterBalance - tokenOutBeforeBalance)/(10**diffOutDecimals)
        let ratio = -diffOutBalance/diffInBalance
  
        let diffInStrBalance = diffInBalance.toFixed(5)
        let diffOutStrBalance = diffOutBalance.toFixed(10)
  
        console.log("Swapped:", diffInStrBalance, tokenInName, "For",  diffOutStrBalance, tokenOutName)
        console.log("Ratio: 1", tokenInName, "=",  ratio, tokenOutName)
  }

  getRoute = async(_recipientAddr, _tradeType, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent) => {
    let tradeType = TradeType.EXACT_INPUT;
    console.log( " EXECUTING getRoute(", _recipientAddr, _tradeType, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent, ")" );
    let result = await this.ARS.getRoute( _recipientAddr, _tradeType, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent );
    // console.log( "getRoute result:", result );
    return result;
  }
    
  getStrPriceQuote = async( _fromTokenAddr, _toTokenAddr, _tokenAmount, _slippagePercent, decimals) => {
    console.log( " EXECUTING getStrPriceQuote(", _fromTokenAddr, _toTokenAddr, _tokenAmount, _slippagePercent, decimals, ")" );
    let result = await this.ARS.getStrPriceQuote(_fromTokenAddr, _toTokenAddr, _tokenAmount, _slippagePercent, decimals)
    await UTS.dumpTokenDetailsByAddress(_fromTokenAddr);
    await UTS.dumpTokenDetailsByAddress(_toTokenAddr);

    let uniContractFrom = UTS.getERC20Contract(_fromTokenAddr)
    let uniContractTo   =  UTS.getERC20Contract(_toTokenAddr)

    // console.log("uniContractFrom.balanceOf", (await uniContractFrom.balanceOf(WALLET_ADDRESS)).toString());
    // console.log("uniContractTo.balanceOf", (await uniContractTo.balanceOf(WALLET_ADDRESS)).toString());
    console.log("strPriceQuote:", await uniContractTo.name(), "(", result, ")");
    return result;
  }
  
  getPriceQuote = async( _tokenIn, _tokenOut, _inputAmount, _slippagePercent) => {
    console.log( " EXECUTING getPriceQuote(", _tokenIn, _tokenOut, _inputAmount, _slippagePercent, ")" );
    let result = await this.ARS.getPriceQuote( _tokenIn, _tokenOut, _inputAmount, _slippagePercent)
    console.log( "getPriceQuote result:", result);
    return result;
  }
  
  getTransaction = ( _route, _walletAddress, _gasLimit ) => {
    console.log( " EXECUTING getTransaction(", _route, _walletAddress, _gasLimit, ")" );
    let result = this.ARS.getTransaction = ( _route, _walletAddress, _gasLimit )
    console.log( "getTransaction result:", result);
    return result;
  }
  
  exeWalletTransactionRoute = async( _walletAddress, _walletPvtKey, _tokenAddrIn, _route, _gasLimit) => {
    console.log( " EXECUTING exeWalletTransactionRoute(", re_walletAddress, _walletPvtKey, _tokenAddrIn, _route, _gasLimitsult, ")" );
    let result = await this.ARS.exeWalletTransactionRoute( _walletAddress, _walletPvtKey, _tokenAddrIn, _route, _gasLimit)
    console.log( "exeWalletTransactionRoute result:", result);
    return result;
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
}


module.exports = {
  AlphaRouterServiceDebug
}
