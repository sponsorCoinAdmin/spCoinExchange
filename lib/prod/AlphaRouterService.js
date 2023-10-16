require("dotenv").config();
const ERC20ABI = require('../interfaces/abi.json')

const { AlphaRouter } = require('@uniswap/smart-order-router')
const { TradeType, Percent } = require('@uniswap/sdk-core')
const { BigNumber } = require('ethers')
const { UniTokenServices } = require('./uniTokenServices')
const { ERC20Services } = require('./erc20Services')

const UNISWAP_SWAPROUTER_02 = process.env.UNISWAP_SWAPROUTER_02
const BURN_ADDRESS = process.env.BURN_ADDRESS;

let router
let UTS
let erc20Services

class AlphaRouterService {
  constructor(_erc20Services) {
    this.erc20Services = _erc20Services
    this.ethers   = _erc20Services.ethers
    this.provider = _erc20Services.provider
    UTS = new UniTokenServices( _erc20Services )
    erc20Services = _erc20Services
    router = new AlphaRouter({ chainId: _erc20Services.chainId, provider: _erc20Services.provider})
    console.log( "DEBUG MODE OFF: AlphaRouterService()");
  }

  getRoute = async(_recipientAddr, _tradeType, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent) => {
    // console.log( "==========================================================================================================" );
    // console.log( " EXECUTING getRoute(", _recipientAddr, _tradeType, _tokenAddrIn, _tokenAddrOut, _amount, _slippagePercent, ")" );

    let uniTokenOut = await UTS.wrapAddrToUniToken(_tokenAddrOut)    
    let amount = await UTS.addrAmountToCurrencyInWei(_amount, _tokenAddrIn)

    let route = await router.route(
      amount,
      uniTokenOut,
      _tradeType,
      {
        recipient: _recipientAddr,
        slippageTolerance: new Percent(_slippagePercent, 100),
        deadline: Math.floor(Date.now()/1000 + 1800)
      }
    )
    // console.log("BBBBBBBBBBBBBB route.quote:", route.quote.toFixed(10))
    // console.log("=======================================================================")
    return route;
  }

  // getStrPriceQuote = async( _tradeType, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, _decimals) => {
  getStrPriceQuote = async( _tradeType, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, _decimals) => {
    let decimals = (_decimals === undefined) ? await uniContractFrom.decimals() : _decimals;
    let quote = await this.getPriceQuote( _tradeType, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent);
    let strPriceQuote = quote.toFixed(decimals);
    return strPriceQuote;
  }

  getPriceQuote = async( _tradeType, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent) => {
    const route = await this.getRoute(BURN_ADDRESS, _tradeType, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent);
    return route.quote
  }

  getTransaction = ( _route, _walletAddress, _gasLimit ) => {
    const transaction = {
      data: _route.methodParameters.calldata,
      to: UNISWAP_SWAPROUTER_02,
      value: BigNumber.from(_route.methodParameters.value),
      from: _walletAddress,
      gasPrice: BigNumber.from(_route.gasPriceWei),
      gasLimit: this.ethers.utils.hexlify(_gasLimit)
    }
    return transaction;
  }

  /////////////////////// WORKING HERE ////////////////////////////////////////////////////
  exeRouteTransaction = async( _wallet, 
                               _approvalAmount,
                               _recipientAddress,
                               _tokenAddrIn,
                               _route,
                               _gasLimit) => {
    const transaction = this.getTransaction(_route, _recipientAddress, _gasLimit )
    const connectedWallet = _wallet.connect(this.provider)
    const contractIn = erc20Services.getERC20Contract(_tokenAddrIn)
    await contractIn.connect(connectedWallet).approve(
      UNISWAP_SWAPROUTER_02,
      _approvalAmount
    )
    const tradeTransaction = await connectedWallet.sendTransaction(transaction)
    return tradeTransaction
  }
  ////////////////////////////////////////////////////////////////////////////////////////

  /* BEFORE MODS */
  exeExactInputTransactionOLD = async(
    _wallet,
    _tokenInAddr,
    _tokenOutAddr,
    _approvalAmount,
    _exactInputAmount,
    _slippagePercent,
    _gasLimit) => {
      let walletAddress = _wallet.address
      let tradeType = TradeType.EXACT_INPUT;
      let route = await this.getRoute( walletAddress, tradeType, _tokenInAddr, _tokenOutAddr, _exactInputAmount, _slippagePercent);
      let quote = route.quote;

      let tokenInContract  = erc20Services.getERC20Contract(_tokenInAddr)
      let tokenOutContract = UTS.getERC20Contract(_tokenOutAddr)
      let tokenInName          = await tokenInContract.name();
      let tokenOutName         = await tokenOutContract.name();

      let tokenInBeforeBalance = await tokenInContract.balanceOf(walletAddress);
      let tokenOutBeforeBalance = await tokenOutContract.balanceOf(walletAddress);
      // console.log(tokenInName, "tokenInBeforeBalance", tokenInBeforeBalance.toString())
      // console.log(tokenOutName, "tokenOutBeforeBalance", tokenOutBeforeBalance.toString())

      tokenOutContract.balanceOf(walletAddress);

      console.log("Swapping:", _exactInputAmount, tokenInName, "For",  quote.toFixed(10), tokenOutName)


      console.log("Pending Transaction:")
      /////////////////////// WORKING HERE ////////////////////////////////////////////////////
      const transaction = this.getTransaction(route, walletAddress, _gasLimit)
      const connectedWallet = _wallet.connect(this.provider)
      await tokenInContract.connect(connectedWallet).approve(
        UNISWAP_SWAPROUTER_02,
        _approvalAmount
      )

      const tradeTransaction = await connectedWallet.sendTransaction(transaction)
      ////////////////////////////////////////////////////////////////////////////////////////

      await tradeTransaction.wait();

      console.log("Transaction Complete")
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

   /* AFTER MODS */
  exeExactInputTransaction = async(
  _wallet,
  _tokenInAddr,
  _tokenOutAddr,
  _approvalAmount,
  _exactInputAmount,
  _slippagePercent,
  _gasLimit) => {
    let walletAddress = _wallet.address
    let tradeType = TradeType.EXACT_INPUT;
    let route = await this.getRoute( walletAddress, tradeType, _tokenInAddr, _tokenOutAddr, _exactInputAmount, _slippagePercent);

    await this.exeExactInputRouteTransaction(
      _wallet,
      route,
      _gasLimit)
  }

   exeExactInputRouteTransaction = async(
    _wallet,
    _route,
    _gasLimit) => {
      let walletAddress = _wallet.address
      let tradeType = TradeType.EXACT_INPUT;

      const transaction = this.getTransaction(_route, walletAddress, _gasLimit)
      const connectedWallet = _wallet.connect(this.provider)
      console.log("Pending Transaction:")
      const tradeTransaction = await connectedWallet.sendTransaction(transaction)

      await tradeTransaction.wait();
      console.log("Transaction Complete")
  }

  exeExactOutputTransaction = async(
    _wallet,
    _tokenInAddr,
    _tokenOutAddr,
    _approvalAmount,
    _exactOutputAmount,
    _slippagePercent,
    _gasLimit) => {
      let walletAddress = _wallet.address

      let tradeType = TradeType.EXACT_OUTPUT;
      let route = await this.getRoute( walletAddress, tradeType, _tokenInAddr, _tokenOutAddr, _exactOutputAmount, _slippagePercent);
      let quote = route.quote;

      let tokenInContract  = erc20Services.getERC20Contract(_tokenInAddr)
      let tokenOutContract = UTS.getERC20Contract(_tokenOutAddr)
      let tokenInName          = await tokenInContract.name();
      let tokenOutName         = await tokenOutContract.name();

      let tokenInBeforeBalance = await tokenInContract.balanceOf(walletAddress);
      let tokenOutBeforeBalance = await tokenOutContract.balanceOf(walletAddress);
      // console.log(tokenInName, "tokenInBeforeBalance", tokenInBeforeBalance.toString())
      // console.log(tokenOutName, "tokenOutBeforeBalance", tokenOutBeforeBalance.toString())

      tokenOutContract.balanceOf(walletAddress);
  
      console.log("Swapping:", _exactOutputAmount, tokenInName, "For",  quote.toFixed(10), tokenOutName)
  
      const transaction = this.getTransaction(route, walletAddress, _gasLimit)
      const connectedWallet = _wallet.connect(this.provider)
      await tokenInContract.connect(connectedWallet).approve(
        UNISWAP_SWAPROUTER_02,
        _approvalAmount
      )

      console.log("Pending Transaction:")
      const tradeTransaction = await connectedWallet.sendTransaction(transaction)
      await tradeTransaction.wait();

      console.log("Transaction Complete")
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

}

module.exports = {
  AlphaRouterService,
  ERC20Services,
  UniTokenServices
}
