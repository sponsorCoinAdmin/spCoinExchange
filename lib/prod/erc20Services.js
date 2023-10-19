const ERC20ABI = require('../interfaces/abi.json')
const { BigNumber } = require('ethers')
const JSBI  = require('jsbi') // jsbi@3.2.5


class ERC20Services {
  constructor(_ethers, _netWorkURL, chainId) {
    if (_ethers === undefined || _netWorkURL === undefined ) {
      throw new Error('Undefined parameter(): Usage: <obj = new ERC20Services(ethers, netWorkURL)>');
    }
    this.ethers     = _ethers
    this.netWorkURL = _netWorkURL
    this.provider   = new _ethers.providers.JsonRpcProvider(_netWorkURL)
    this.chainId    = chainId
  }

  Wallet = (_pvtKey) => {
    return new this.ethers.Wallet(_pvtKey)
  }

  getContractName = async(_tokenContract) => {
    return await _tokenContract.name()
  }

  getContractSymbol = async(_tokenContract) => {
    return await _tokenContract.symbol()
  }

  getContractDecimals = async(_tokenContract) => {
    return await _tokenContract.decimals()
  }

  getContractBalanceOf = async(_tokenContract, _walletAddress) => {
    return await _tokenContract.balanceOf(_walletAddress)
  }

  getContractNameSymbol = async(_tokenContract) => {
    let name = await _tokenContract.name()
    let symbol = await _tokenContract.symbol()
    let nameSymbol = name+"("+symbol+")"
    return nameSymbol
  }

  getName = async(_tokenAddress) => {
    let tokenContract = this.getERC20Contract(_tokenAddress);
    return await this.getContractName(tokenContract)
  }

  getSymbol = async(_tokenAddress) => {
    let tokenContract = this.getERC20Contract(_tokenAddress);
    return await this.getContractSymbol(tokenContract)
  }

  getDecimals = async(_tokenAddress) => {
    let tokenContract = this.getERC20Contract(_tokenAddress);
    return await this.getContractDecimals(tokenContract)
  }

  getBalanceOf = async(_tokenAddress, _walletAddress) => {
    console.log("getBalanceOf:", _tokenAddress);
    let tokenContract = this.getERC20Contract(_tokenAddress);
    return await this.getContractBalanceOf(tokenContract)
  }

  getERC20Contract = (_tokenAddress) => {
    return new this.ethers.Contract(_tokenAddress, ERC20ABI, this.provider)
  }

  getNameSymbol = async(_tokenAddress) => {
    let tokenContract = this.getERC20Contract(_tokenAddress );
    return await this.getContractNameSymbol( tokenContract )
  }

  getAddressNameSymbol = async(_tokenAddress) => {
    let tokenContract = this.getERC20Contract(_tokenAddress );
    return "" + _tokenAddress + " => " + await this.getContractNameSymbol( tokenContract )
  }

  async depositEthToWethAddress(_wallet, _wethAddress, _ethAmountInWei) {
    let wethContract = this.getERC20Contract(_wethAddress );
    await _depositEthToWethContract(_wallet, wethContract, _ethAmountInWei);
  }

  async withdrawEthFromWethAddress(_wallet, _wethAddress, _wethAmountInWei) {
    let wethContract = this.getERC20Contract(_wethAddress );
    await withdrawEthFromWethContract(_wallet, wethContract, _ethAmountInWei);
  }

  async depositEthToWethContract(_wallet, _wethContract, _ethAmountInWei) {
    // await _wethContract.connect(this.signerAccount).deposit({ value: _ethAmountInWei });
    await _wethContract.connect(_wallet).deposit({ value: _ethAmountInWei });
  }

  async withdrawEthFromWethContract(_wallet, _wethContract, _wethAmountInWei) {
      // await _wethContract.connect(this.signerAccount).withdraw( _wethAmountInWei );
      await _wethContract.connect(_wallet).withdraw( _wethAmountInWei );
  }

  // Deposit a specified account of ETH to WETH
  async depositEthToWeth(_wallet, _wethContract, _ethAmountInWei) {
    // await _wethContract.connect(this.signerAccount).deposit({ value: _ethAmountInWei });
    await _wethContract.connect(_wallet).deposit({ value: _ethAmountInWei });
  }

  async withdrawEthFromWeth(_wallet, _wethContract, _wethAmountInWei) {
      // await _wethContract.connect(this.signerAccount).withdraw( _wethAmountInWei );
      await _wethContract.connect(_wallet).withdraw( _wethAmountInWei );
  }

  weiAmountToCurrencyInToken = (weiAmount, decimals) => {
    let wei = this.ethers.utils.parseUnits(tokenAmount.toString(), 18)
    return CurrencyAmount.fromRawAmount(uniToken, JSBI.BigInt(wei))
  }

  tokenAddrToBigintAmt = async(_tokenAddress, _amount) => {
    let tokenContract = this.getERC20Contract( _tokenAddress );
    return await this.tokenContractAmtToBigInt(tokenContract, _amount);
  }

  tokenContractAmtToBigInt = async( _tokenContract, _amount ) => {
    let decimals = await _tokenContract.decimals();
    let wei = this.tokenAmtToBigint( _amount, decimals )
    return wei
  }

  tokenAmtToBigint = (_tokenAmt, _decimals) => {
    let wei = this.ethers.utils.parseUnits( "" + _tokenAmt, _decimals )
    return wei
  }

  //////////////////////////////////////////////////////

  bigIntToTokenAddrAmt = async(_tokenAddress, _bigInt) => {
    let tokenContract = this.getERC20Contract( _tokenAddress );
    return await this.bigIntToTokenContractAmt(tokenContract, _bigInt);
  }

  bigIntToTokenContractAmt = async( _tokenContract, _bigInt ) => {
    let decimals = await _tokenContract.decimals();
    let wei = this.bigIntToTokenAmt( _bigInt, decimals )
    return wei
  }

  bigIntToTokenAmt = (_bigInt, _decimals) => {
    let bigNum = BigNumber.from(_bigInt)
    let base = BigNumber.from(10)
    let expOffset = base.pow( _decimals ).toString()
    let wholePart = BigNumber.from(bigNum).div(expOffset)
    let mantissa = BigNumber.from(bigNum).mod(expOffset)
    mantissa = String(mantissa.toString()).padStart(_decimals, '0');
    let tokenStrAmt = wholePart + "." + mantissa
    // console.log("_bigInt    :", _bigInt)
    // console.log("_decimals  :", _decimals)
    // console.log("expOffset  :", expOffset)
    // console.log("wholePart  :", wholePart.toString())
    // console.log("mantissa   :", mantissa.toString())
    // console.log("tokenStrAmt:", tokenStrAmt)
    return tokenStrAmt
  }
}

module.exports = {
  ERC20Services
}
