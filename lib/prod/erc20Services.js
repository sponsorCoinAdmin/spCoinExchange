const ERC20ABI = require('../interfaces/abi.json')

class ERC20Services {
  constructor(ethers, provider) {
    this.ethers   = ethers
    this.provider = provider
  }

   getContractName = async(_tokenIContract) => {
    return await _tokenIContract.name()
  }

  getContractSymbol = async(_tokenIContract) => {
    return await _tokenIContract.symbol()
  }

  getContractDecimals = async(_tokenIContract) => {
    return await _tokenIContract.decimals()
  }

  getName = async(_tokenInAddr) => {
    tokenIContract = getERC20Contract(_tokenInAddr);
    return await tokenIContract.name()
  }

  getSymbol = async(_tokenInAddr) => {
    tokenIContract = getERC20Contract(_tokenInAddr);
    return await tokenIContract.symbol()
  }

  getDecimals = async(_tokenInAddr) => {
    tokenIContract = getERC20Contract(_tokenInAddr);
    return await tokenIContract.decimals()
  }

  getERC20Contract = (_tokenInAddr) => {
    return new this.ethers.Contract(_tokenInAddr, ERC20ABI, this.provider)
  }

 }

module.exports = {
  ERC20Services
}
