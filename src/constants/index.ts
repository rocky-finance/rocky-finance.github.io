import appLogo from "../assets/icons/logo.svg"
import daiLogo from "../assets/icons/dai.svg"
import usdcLogo from "../assets/icons/usdc.svg"

export const NetworkContextName = "NETWORK"
export const BTC_POOL_NAME = "BTC Pool"
export const STABLECOIN_POOL_NAME = "Stablecoin Pool"
export type PoolName = typeof BTC_POOL_NAME | typeof STABLECOIN_POOL_NAME

export enum ChainId {
  // MAINNET = 1,
  ROPSTEN = 3,
  // RINKEBY = 4,
  // GÖRLI = 5,
  // KOVAN = 42,
  HARDHAT = 31337,
}

export class Token {
  readonly addresses: { [chainId in ChainId]: string }
  readonly decimals: number
  readonly symbol: string
  readonly name: string
  readonly icon: string
  readonly geckoId: string

  constructor(
    addresses: { [chainId in ChainId]: string },
    decimals: number,
    symbol: string,
    geckoId: string,
    name: string,
    icon: string,
  ) {
    this.addresses = addresses
    this.decimals = decimals
    this.symbol = symbol
    this.geckoId = geckoId
    this.name = name
    this.icon = icon
  }
}

export const BLOCK_TIME = 15000

export const ROCKY_MASTERCHEF_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.ROPSTEN]: "0x1f4019cfa2751dc69393153Ef35216329A63773d",
  [ChainId.HARDHAT]: "TODO",
}
export const STABLECOIN_SWAP_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.ROPSTEN]: "0x7603B0774d89DD1FdCbC9d5e6b68EBe9314B5c09",
  [ChainId.HARDHAT]: "0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8",
}

export const STABLECOIN_SWAP_TOKEN_CONTRACT_ADDRESSES: {
  [chainId in ChainId]: string
} = {
  [ChainId.ROPSTEN]: "0x07f1cf8a575a4ee4e537c3548b51f46f6792cd3f",
  [ChainId.HARDHAT]: "0xB955b6c65Ff69bfe07A557aa385055282b8a5eA3",
}

export const STABLECOIN_SWAP_TOKEN = new Token(
  STABLECOIN_SWAP_TOKEN_CONTRACT_ADDRESSES,
  18,
  "rUSDp",
  "rusdp",
  "Rocky USD primo",
  daiLogo,
)

export const ROCKY_TOKEN_CONTRACT_ADDRESSES: {
  [chainId in ChainId]: string
} = {
  [ChainId.ROPSTEN]: "0x87470df63d3c2Fa95143626e861AB2471aaf0dCb",
  [ChainId.HARDHAT]: "TODO",
}

export const ROCKY_TOKEN = new Token(
  ROCKY_TOKEN_CONTRACT_ADDRESSES,
  18,
  "ROCKY",
  "",
  "ROCKY",
  appLogo,
)

// Stablecoins
const WXDAI_CONTRACT_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.ROPSTEN]: "0x0a2A3efF28b22d843837a9c1Dc207434E815ebA2",
  [ChainId.HARDHAT]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
}
export const WXDAI = new Token(
  WXDAI_CONTRACT_ADDRESSES,
  18,
  "WXDAI",
  "dai",
  "WXDAI",
  daiLogo,
)

const USDC_CONTRACT_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.ROPSTEN]: "0xC672c09C556637b5e6A2D45C5342a9E740cCD193",
  [ChainId.HARDHAT]: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
}
export const USDC = new Token(
  USDC_CONTRACT_ADDRESSES,
  6,
  "USDC",
  "usd-coin",
  "USDC",
  usdcLogo,
)

const BSC_DAI_CONTRACT_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.ROPSTEN]: "0x1BD323D9210E49060C3d02CA4063b7c8fDC68140",
  [ChainId.HARDHAT]: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
}
export const BSC_DAI = new Token(
  BSC_DAI_CONTRACT_ADDRESSES,
  18,
  "bscDAI",
  "dai",
  "DAI (BSC)",
  daiLogo,
)

const BSC_USDC_CONTRACT_ADDRESSES: { [chainId in ChainId]: string } = {
  [ChainId.ROPSTEN]: "0xE4301652D7efA890B671A96f399FbA36198cA27a",
  [ChainId.HARDHAT]: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
}
export const BSC_USDC = new Token(
  BSC_USDC_CONTRACT_ADDRESSES,
  18,
  "bscUSDC",
  "usd-coin",
  "USDC (BSC)",
  usdcLogo,
)

export const STABLECOIN_POOL_TOKENS = [WXDAI, USDC, BSC_DAI, BSC_USDC]

// maps a symbol string to a token object
export const TOKENS_MAP: {
  [symbol: string]: Token
} = STABLECOIN_POOL_TOKENS.concat([ROCKY_TOKEN, STABLECOIN_SWAP_TOKEN]).reduce(
  (acc, token) => ({ ...acc, [token.symbol]: token }),
  {},
)

export const POOLS_MAP: {
  [poolName: string]: Token[]
} = {
  [STABLECOIN_POOL_NAME]: STABLECOIN_POOL_TOKENS,
}

export const MASTERCHEF_POOLS: Array<{ token: Token; contract_pid: number }> = [
  {
    token: STABLECOIN_SWAP_TOKEN,
    contract_pid: 1,
  },
  {
    token: ROCKY_TOKEN,
    contract_pid: 0,
  },
]

export const TRANSACTION_TYPES = {
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
  SWAP: "SWAP",
}

export const POOL_FEE_PRECISION = 10

export const DEPLOYED_BLOCK: { [chainId in ChainId]: number } = {
  [ChainId.ROPSTEN]: 9788429,
  [ChainId.HARDHAT]: 0,
}

export const POOL_STATS_URL: { [chainId in ChainId]: string } = {
  [ChainId.ROPSTEN]: "https://ipfs.saddle.exchange/pool-stats.json",
  [ChainId.HARDHAT]:
    "https://mehmeta-team-bucket.storage.fleek.co/pool-stats-dev.json",
}

export enum REFS {
  TRANSACTION_INFO = "https://docs.saddle.finance/faq#what-are-saddles-liquidity-provider-rewards",
  CONTRACT_INFO = "https://github.com/saddle-finance/saddle-contract",
  AUDITS_INFO = "https://github.com/saddle-finance/saddle-audits",
  GAS_FETCH = "https://www.gasnow.org/api/v3/gas/price?utm_source=saddle",
}
