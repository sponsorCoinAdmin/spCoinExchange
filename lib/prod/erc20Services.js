const ERC20ABI = require('../interfaces/abi.json')
const WETH_ABI = require('../interfaces/WETH_ABI.json')

const { BigNumber } = require('ethers')
const ETH_DECIMALS = 18

class ERC20Services {
  constructor(_ethers, _netWorkURL, chainId) {
    if (_ethers === undefined || _netWorkURL === undefined || chainId === undefined) {
      throw new Error('Undefined parameter(): Usage: <obj = new ERC20Services(ethers, netWorkURL, chainId)>');
    }
    this.ethers     = _ethers
    this.netWorkURL = _netWorkURL
    this.provider   = new _ethers.providers.JsonRpcProvider(_netWorkURL)
    this.chainId    = chainId
  }

  Wallet = (_pvtKey) => {
    let wallet = new this.ethers.Wallet(_pvtKey, this.provider)
    return wallet
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

  getContractBalanceOf = async(_walletAddress, _tokenContract) => {
    console.log("_walletAddress", _walletAddress);
    console.log("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
    let balanceOf = await _tokenContract.balanceOf(_walletAddress)
    console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
    return balanceOf
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

  getBalanceOf = async( _walletAddress, _tokenAddress ) => {
    console.log("getBalanceOf(", _walletAddress, ",", _tokenAddress, ")");
    let tokenContract = this.getERC20Contract(_tokenAddress);
    return await this.getContractBalanceOf( _walletAddress, tokenContract )
  }

  getERC20Contract = (_tokenAddress) => {
    return new this.ethers.Contract(_tokenAddress, ERC20ABI, this.provider)
  }

  getWETHContract = (_tokenAddress) => {
    return new this.ethers.Contract(_tokenAddress, WETH_ABI, this.provider)
  }

  getNameSymbol = async(_tokenAddress) => {
    let tokenContract = this.getERC20Contract(_tokenAddress );
    return await this.getContractNameSymbol( tokenContract )
  }

  getAddressNameSymbol = async(_tokenAddress) => {
    let tokenContract = this.getERC20Contract(_tokenAddress );
    return "" + _tokenAddress + " => " + await this.getContractNameSymbol( tokenContract )
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  // ToDo: Find out if this is Used
  /*
  weiAmountToCurrencyInToken = (weiAmount, decimals) => {
    let wei = this.ethers.utils.parseUnits(tokenAmount.toString(), 18)
    return CurrencyAmount.fromRawAmount(uniToken, JSBI.BigInt(wei))
  }
*/

  tokenAddrToBigintAmt = async(_tokenAddress, _amount) => {
    let tokenContract = this.getERC20Contract( _tokenAddress );
    return await this.tokenContractAmtToBigInt(tokenContract, _amount);
  }

  tokenContractAmtToBigInt = async( _tokenContract, _amount ) => {
    let decimals = await _tokenContract.decimals();
    let bigIntAmount = this.tokenAmtToBigint( _amount, decimals )
    return bigIntAmount
  }

  tokenAmtToBigint = (_tokenAmt, _decimals) => {
    let bigIntAmount = this.ethers.utils.parseUnits( "" + _tokenAmt, _decimals )
    return bigIntAmount
  }

  bigIntToTokenAddrAmt = async(_tokenAddress, _bigInt) => {
    let tokenContract = this.getERC20Contract( _tokenAddress );
    return await this.bigIntToTokenContractAmt(tokenContract, _bigInt);
  }

  bigIntToTokenContractAmt = async( _tokenContract, _bigInt ) => {
    let decimals = await _tokenContract.decimals();
    let bigIntAmount = this.bigIntToTokenAmt( _bigInt, decimals )
    return bigIntAmount
  }

  bigIntToTokenAmt = (_bigInt, _decimals) => {
  console.log("_bigInt    :", _bigInt)
  console.log("_decimals  :", _decimals)
  console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
  let bigNum = BigNumber.from(_bigInt)
  console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
  let base = BigNumber.from(10)
    console.log("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC")
    let expOffset = base.pow( _decimals ).toString()
    let wholePart = BigNumber.from(bigNum).div(expOffset)
    let mantissa = BigNumber.from(bigNum).mod(expOffset)
    mantissa = String(mantissa.toString()).padStart(_decimals, '0');
    mantissa = removeTrailingZeros(mantissa)
    let tokenStrAmt = wholePart + "." + mantissa
    // console.log("expOffset  :", expOffset)
    // console.log("wholePart  :", wholePart.toString())
    // console.log("mantissa   :", mantissa.toString())
    // console.log("tokenStrAmt:", tokenStrAmt)
    return tokenStrAmt
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////

 wrapEthAmtByAddress = async(_wallet, _wethAddress, _ethAmount) => {
    let weiAmount = this.tokenAmtToBigint(_ethAmount, ETH_DECIMALS)
    let wethContract = this.getWETHContract(_wethAddress );
    console.log("BEFORE DDDDDDDDDDDDDDDDDDDDDDDDDD")
    await this.wrapWeiAmtByAddress(_wallet, wethContract, weiAmount);
    console.log("AFTER  DDDDDDDDDDDDDDDDDDDDDDDDDD")
  }

  


  unwrapEthAmtByAddress = async(_wallet, _wethAddress, _ethAmount) => {
    let weiAmount = this.tokenAmtToBigint(_ethAmount, ETH_DECIMALS)
    let wethContract = this.getWETHContract(_wethAddress );
    await this.unwrapWeiAmtByAddress(_wallet, wethContract, weiAmount);
  }

  wrapEthAmtByContract = async(_wallet, _wethContract, _ethAmount) => {
    let weiAmount = this.tokenAmtToBigint(_ethAmount, ETH_DECIMALS)
    await this.wrapWeiAmtByContract(_wallet, _wethContract, weiAmount);
  }

  unwrapEthAmtByContract = async(_wallet, _wethContract, _ethAmount) => {
    let weiAmount = this.tokenAmtToBigint(_ethAmount, ETH_DECIMALS)
    await this.unwrapWeiAmtByContract(_wallet, _wethContract, weiAmount);
  }
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////

  wrapWeiAmtByAddress_OLD = async(_wallet, _wethAddress, _weiAmount) => {
    let wethContract = this.getWETHContract(_wethAddress );
    console.log("BEFORE FFFFFFFFFFFFFFFFFFFFFFFFFFFF")
    await this.wrapWeiAmtByContract(_wallet, wethContract, _weiAmount);
  }
  
wrapWeiAmtByAddress = async(_wallet, _wethAddress, _weiAmount) => {
    // let wethContract = this.getWETHContract(_wethAddress );
    console.log("BEFORE FFFFFFFFFFFFFFFFFFFFFFFFFFFF")
    /* // Ensure ethAmountInWei is a string */
    const WETH_ADDRESS = process.env.GOERLI_WETH
    const WALLET_SECRET = process.env.WALLET_SECRET
    const GOERLI_INFURA_TEST_URL = process.env.GOERLI_INFURA_TEST_URL

    let ethAmountInWei = "" + _weiAmount
    let provider = new this.ethers.providers.JsonRpcProvider(GOERLI_INFURA_TEST_URL);
    let wallet = new this.ethers.Wallet(WALLET_SECRET, provider)
    let wethContract = new this.ethers.Contract(WETH_ADDRESS, WETH_ABI, wallet)
    // console.log(`wethContract = ethers.Contract(${WETH_ADDRESS}, ${WETH_ABI}, ${provider}`)
    await wethContract.connect(wallet).deposit({ value: ethAmountInWei });
/**/

    // await this.wrapWeiAmtByContract(_wallet, wethContract, _weiAmount);
  }

  unwrapWeiAmtByAddress = async(_wallet, _wethAddress, _weiAmount) => {
    let wethContract = this.getWETHContract(_wethAddress );
    await this.unwrapWeiAmtByContract(_wallet, wethContract, _weiAmount);
  }

  wrapWeiAmtByContract = async(_wallet, _wethContract, _weiAmount) => {
    console.log(`wrapWeiAmtByContract = async(${_wallet.address}, ${JSON.stringify(_wethContract, null, 2)}, ${_weiAmount})`)
    console.log("BEFORE HERE 5")
    await _wethContract.connect(_wallet).deposit({ value: _weiAmount });
    console.log("AFTER HERE 5")

    // await _wethContract.connect(this.signerAccount).deposit({ value: _weiAmount });
  }

  unwrapWeiAmtByContract = async(_wallet, _wethContract, _weiAmount) => {
    // Ensure ethAmountInWei is a string
    let weiAmount = "" + _weiAmount

    await _wethContract.connect(_wallet).withdraw( weiAmount );
    // await _wethContract.connect(this.signerAccount).withdraw( _wethAmountInWei );
  }

}


function removeTrailingZeros(string){
  return string.replace(/0+$/, '');
}

module.exports = {
  ERC20Services
}
