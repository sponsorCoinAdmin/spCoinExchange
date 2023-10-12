require("dotenv").config();

let UTS

const { AlphaRouterService, UniTokenServices } = require('../prod/AlphaRouterService')

class AlphaRouterServiceDebug {
    constructor(ethers, chainId, provider) {
      UTS = new UniTokenServices(ethers, chainId, provider)

      this.ars = new AlphaRouterService()
      console.log( "DEBUG MODE ON: AlphaRouterServiceDebug");
  }

  getRoute = async(_recipientAddr, _tokenOut, _inputAmount, _slippagePercent) => {
    let tradeType = TradeType.EXACT_INPUT;
    console.log( " EXECUTING getRoute( tradeType, ", _recipientAddr, _tokenOut, _inputAmount, _slippagePercent, ")" );
    let result = await this.ars.getRoute( tradeType, _recipientAddr, _tokenOut, _inputAmount, _slippagePercent);
    console.log( "getRoute result:", result);
    return result;
  }

  getRoute = async(_recipientAddr, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent) => {
    let tradeType = TradeType.EXACT_INPUT;
    console.log( " EXECUTING getRoute( tradeType, ", _recipientAddr,  _tokenOut, _inputAmount, _slippagePercent, ")" );
    let result = await this.ars.getRoute( tradeType, _recipientAddr, _tokenOut, _inputAmount, _slippagePercent);
    console.log( "getRoute result:", result);
    return result;
  }

    
  getStrPriceQuote = async( _fromTokenAddr, _toTokenAddr, _tokenAmount, _slippagePercent, decimals) => {
      console.log( " EXECUTING getStrPriceQuote(", _fromTokenAddr, _toTokenAddr, _tokenAmount, _slippagePercent, decimals, ")" );
      let result = await this.ars.getStrPriceQuote(_fromTokenAddr, _toTokenAddr, _tokenAmount, _slippagePercent, decimals)
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
    let result = await this.ars.getPriceQuote( _tokenIn, _tokenOut, _inputAmount, _slippagePercent)
    console.log( "getPriceQuote result:", result);
    return result;
  }
  
  getTransaction = ( _route, _walletAddress, _gasLimit ) => {
    console.log( " EXECUTING getTransaction(", _route, _walletAddress, _gasLimit, ")" );
    let result = this.ars.getTransaction = ( _route, _walletAddress, _gasLimit )
    console.log( "getTransaction result:", result);
    return result;
  }
  
  exeRouteTransaction = async( _walletAddress, _walletPvtKey, _tokenAddrIn, _route, _gasLimit) => {
    console.log( " EXECUTING exeRouteTransaction(", re_walletAddress, _walletPvtKey, _tokenAddrIn, _route, _gasLimitsult, ")" );
    let result = await this.ars.exeRouteTransaction( _walletAddress, _walletPvtKey, _tokenAddrIn, _route, _gasLimit)
    console.log( "exeRouteTransaction result:", result);
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
      let result = await this.ars.exeTransaction(
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
