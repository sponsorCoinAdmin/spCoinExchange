const ERC20ABI = require('../interfaces/abi.json')

class ERC20Services {
  constructor(ethers, netWorkURL) {
    if (ethers === undefined || netWorkURL === undefined ) {
      throw new Error('Undefined parameter(): Usage: <obj = new ERC20Services(ethers, netWorkURL)>');
    }
    this.ethers    = ethers
    this.netWorkURL  = netWorkURL
    this.provider = new ethers.providers.JsonRpcProvider(netWorkURL)
  }

  init = async(network) => {
    
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
    return new this.ethers.Contract(_tokenInAddr, ERC20ABI, this.netWorkURL)
  }

  wallet = (_pvtKey) => {
    return new this.ethers.Wallet(_pvtKey)
  }

}

module.exports = {
  ERC20Services
}
