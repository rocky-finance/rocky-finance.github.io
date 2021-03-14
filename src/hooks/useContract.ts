import {
  BSC_DAI,
  BSC_USDC,
  PoolName,
  ROCKY_MASTERCHEF_ADDRESSES,
  ROCKY_TOKEN,
  STABLECOIN_POOL_NAME,
  STABLECOIN_SWAP_ADDRESSES,
  STABLECOIN_SWAP_TOKEN,
  Token,
  USDC,
  WXDAI,
} from "../constants"
import { useMemo, useState } from "react"

import { Contract } from "@ethersproject/contracts"
import ERC20_ABI from "../constants/abis/erc20.json"
import { Erc20 } from "../../types/ethers-contracts/Erc20"
import LPTOKEN_ABI from "../constants/abis/lpToken.json"
import { LpToken } from "../../types/ethers-contracts/LpToken"
import ROCKY_MASTERCHEF_ABI from "../constants/abis/rockyMasterChef.json"
import { RockyMasterChef } from "../../types/ethers-contracts/RockyMasterChef"
import SWAP_ABI from "../constants/abis/swap.json"
import { Swap } from "../../types/ethers-contracts/Swap"
import { getContract } from "../utils"
import { useActiveWeb3React } from "./index"

// returns null on errors
function useContract(
  address: string | undefined,
  ABI: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  withSignerIfPossible = true,
): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined,
      )
    } catch (error) {
      console.error("Failed to get contract", error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useRockyMasterChefContract(): RockyMasterChef | null {
  const withSignerIfPossible = true
  const { chainId } = useActiveWeb3React()
  const masterChefContract = useContract(
    chainId ? ROCKY_MASTERCHEF_ADDRESSES[chainId] : undefined,
    ROCKY_MASTERCHEF_ABI,
    withSignerIfPossible,
  )
  return masterChefContract as RockyMasterChef
}

export function useTokenContract(
  t: Token,
  withSignerIfPossible?: boolean,
): Contract | null {
  const { chainId } = useActiveWeb3React()
  const tokenAddress = chainId ? t.addresses[chainId] : undefined
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useSwapContract(poolName: PoolName): Swap | null {
  const withSignerIfPossible = true
  const { chainId } = useActiveWeb3React()
  const stablecoinSwapContract = useContract(
    chainId ? STABLECOIN_SWAP_ADDRESSES[chainId] : undefined,
    SWAP_ABI,
    withSignerIfPossible,
  )
  return useMemo(() => {
    if (poolName === STABLECOIN_POOL_NAME) {
      return stablecoinSwapContract as Swap
    } else {
      return stablecoinSwapContract as Swap
    }
  }, [stablecoinSwapContract, poolName])
}

export function useLPTokenContract(poolName: PoolName): LpToken | null {
  const swapContract = useSwapContract(poolName)
  const [lpTokenAddress, setLPTokenAddress] = useState("")
  void swapContract
    ?.swapStorage()
    .then(({ lpToken }: { lpToken: string }) => setLPTokenAddress(lpToken))
  return useContract(lpTokenAddress, LPTOKEN_ABI) as LpToken
}

interface AllContractsObject {
  [x: string]: Swap | Erc20 | null
}
export function useAllContracts(): AllContractsObject | null {
  const wxdaiContract = useTokenContract(WXDAI) as Erc20
  const usdcContract = useTokenContract(USDC) as Erc20
  const bscDaiContract = useTokenContract(BSC_DAI) as Erc20
  const bscUSDCContract = useTokenContract(BSC_USDC) as Erc20
  const rockyTokenContract = useTokenContract(ROCKY_TOKEN) as Erc20
  const stablecoinSwapTokenContract = useTokenContract(
    STABLECOIN_SWAP_TOKEN,
  ) as Swap

  return useMemo(() => {
    if (
      ![
        wxdaiContract,
        usdcContract,
        bscDaiContract,
        bscUSDCContract,
        rockyTokenContract,
        stablecoinSwapTokenContract,
      ].some(Boolean)
    )
      return null
    return {
      [WXDAI.symbol]: wxdaiContract,
      [USDC.symbol]: usdcContract,
      [BSC_DAI.symbol]: bscDaiContract,
      [BSC_USDC.symbol]: bscUSDCContract,
      [ROCKY_TOKEN.symbol]: rockyTokenContract,
      [STABLECOIN_SWAP_TOKEN.symbol]: stablecoinSwapTokenContract,
    }
  }, [
    wxdaiContract,
    usdcContract,
    bscDaiContract,
    bscUSDCContract,
    rockyTokenContract,
    stablecoinSwapTokenContract,
  ])
}
