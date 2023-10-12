require("dotenv").config();
const ERC20ABI = require('../interfaces/abi.json')

const { AlphaRouter } = require('@uniswap/smart-order-router')
const { TradeType, Percent } = require('@uniswap/sdk-core')
const { BigNumber } = require('ethers')
const { UniTokenServices } = require('./uniTokenServices')

const UNISWAP_SWAPROUTER_02 = process.env.UNISWAP_SWAPROUTER_02
const BURN_ADDRESS = process.env.BURN_ADDRESS;

let router
let UTS

class AlphaRouterService {
  constructor(ethers, chainId, provider) {
    this.ethers   = ethers
    this.provider = provider
    UTS = new UniTokenServices(ethers, chainId, provider)
    router = new AlphaRouter({ chainId: chainId, provider: provider})
    console.log( "DEBUG MODE OFF: AlphaRouterService()");
  }

  getRoute = async(_tradeType, _recipientAddr, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent) => {
    // console.log( "==========================================================================================================" );
    // console.log( " EXECUTING getRoute(", _tradeType,  _recipientAddr, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, ")" );
    console.log( " EXECUTING getRoute(", _tradeType, _recipientAddr, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent, ")" );

    let uniTokenOut = await UTS.wrapAddrToUniToken(_tokenAddrOut)    
    let inputAmount = await UTS.addrAmountToCurrencyInWei(_inputAmount, _tokenAddrIn)

    let route = await router.route(
      inputAmount,
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
    const route = await this.getRoute( _tradeType, BURN_ADDRESS, _tokenAddrIn, _tokenAddrOut, _inputAmount, _slippagePercent);
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
  
  exeRouteTransaction = async( _recipientAddress, _walletPvtKey, _tokenAddrIn, _route, _gasLimit) => {
    const transaction = this.getTransaction(_route, _recipientAddress, _gasLimit )
    const wallet = new this.ethers.Wallet(_walletPvtKey)
    const connectedWallet = wallet.connect(this.provider)
    const approvalAmount = this.ethers.utils.parseUnits('1', 18).toString()
    const contractIn = new this.ethers.Contract(_tokenAddrIn, ERC20ABI, this.provider)
    await contractIn.connect(connectedWallet).approve(
      UNISWAP_SWAPROUTER_02,
      approvalAmount
    )
    const tradeTransaction = await connectedWallet.sendTransaction(transaction)
    return tradeTransaction
  }
      /* BEFORE MODS */
  exeExactInputTransaction = async(
    _walletAddress,
    _walletPvtKey,
    _tokenInAddr,
    _tokenOutAddr,
    _approvalAmount,
    _inputAmount,
    _slippagePercent,
    _gasLimit) => {
      let tradeType = TradeType.EXACT_INPUT;
      let route = await this.getRoute( tradeType, _walletAddress, _tokenInAddr, _tokenOutAddr, _inputAmount, _slippagePercent);
      let quote = route.quote;

      let tokenInContract  = new this.ethers.Contract(_tokenInAddr, ERC20ABI, this.provider)
      let tokenOutContract = UTS.getERC20Contract(_tokenOutAddr)
      let tokenInName          = await tokenInContract.name();
      let tokenOutName         = await tokenOutContract.name();

      let tokenInBeforeBalance = await tokenInContract.balanceOf(_walletAddress);
      let tokenOutBeforeBalance = await tokenOutContract.balanceOf(_walletAddress);
      // console.log(tokenInName, "tokenInBeforeBalance", tokenInBeforeBalance.toString())
      // console.log(tokenOutName, "tokenOutBeforeBalance", tokenOutBeforeBalance.toString())

      tokenOutContract.balanceOf(_walletAddress);
  
      console.log("Swapping:", _inputAmount, tokenInName, "For",  quote.toFixed(10), tokenOutName)
  
      const transaction = this.getTransaction(route, _walletAddress, _gasLimit)
      const wallet = new this.ethers.Wallet(_walletPvtKey)
      const connectedWallet = wallet.connect(this.provider)
      await tokenInContract.connect(connectedWallet).approve(
        UNISWAP_SWAPROUTER_02,
        _approvalAmount
      )

      console.log("Pending Transaction:")
      const tradeTransaction = await connectedWallet.sendTransaction(transaction)
      await tradeTransaction.wait();

      console.log("Transaction Complete")
      let tokenInAfterBalance = await tokenInContract.balanceOf(_walletAddress);
      let tokenOutAfterBalance = await tokenOutContract.balanceOf(_walletAddress);
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

  exeExactOutputTransaction = async(
    _walletAddress,
    _walletPvtKey,
    _tokenInAddr,
    _tokenOutAddr,
    _approvalAmount,
    _inputAmount,
    _slippagePercent,
    _gasLimit) => {
      let tradeType = TradeType.EXACT_OUTPUT;
      let route = await this.getRoute( tradeType, _walletAddress, _tokenInAddr, _tokenOutAddr, _inputAmount, _slippagePercent);
      let quote = route.quote;

      let tokenInContract  = new this.ethers.Contract(_tokenInAddr, ERC20ABI, this.provider)
      let tokenOutContract = UTS.getERC20Contract(_tokenOutAddr)
      let tokenInName          = await tokenInContract.name();
      let tokenOutName         = await tokenOutContract.name();

      let tokenInBeforeBalance = await tokenInContract.balanceOf(_walletAddress);
      let tokenOutBeforeBalance = await tokenOutContract.balanceOf(_walletAddress);
      // console.log(tokenInName, "tokenInBeforeBalance", tokenInBeforeBalance.toString())
      // console.log(tokenOutName, "tokenOutBeforeBalance", tokenOutBeforeBalance.toString())

      tokenOutContract.balanceOf(_walletAddress);
  
      console.log("Swapping:", _inputAmount, tokenInName, "For",  quote.toFixed(10), tokenOutName)
  
      const transaction = this.getTransaction(route, _walletAddress, _gasLimit)
      const wallet = new this.ethers.Wallet(_walletPvtKey)
      const connectedWallet = wallet.connect(this.provider)
      await tokenInContract.connect(connectedWallet).approve(
        UNISWAP_SWAPROUTER_02,
        _approvalAmount
      )

      console.log("Pending Transaction:")
      const tradeTransaction = await connectedWallet.sendTransaction(transaction)
      await tradeTransaction.wait();

      console.log("Transaction Complete")
      let tokenInAfterBalance = await tokenInContract.balanceOf(_walletAddress);
      let tokenOutAfterBalance = await tokenOutContract.balanceOf(_walletAddress);
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
  UniTokenServices
}
