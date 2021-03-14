import { BLOCK_TIME, Token } from "../../constants"
import {
  BSC_DAI,
  BSC_USDC,
  PoolName,
  STABLECOIN_POOL_NAME,
  USDC,
  WXDAI,
} from "../../constants"

import { BigNumber } from "@ethersproject/bignumber"
import { Erc20 } from "../../../types/ethers-contracts/Erc20"
import { useActiveWeb3React } from "../../hooks"
import { useMemo } from "react"
import usePoller from "../../hooks/usePoller"
import { useState } from "react"
import { useTokenContract } from "../../hooks/useContract"

export function useTokenBalance(t: Token): BigNumber {
  const { account, chainId } = useActiveWeb3React()
  const [balance, setBalance] = useState<BigNumber>(BigNumber.from(0))

  const tokenContract = useTokenContract(t) as Erc20

  usePoller((): void => {
    async function pollBalance(): Promise<void> {
      const newBalance = account
        ? await tokenContract?.balanceOf(account)
        : BigNumber.from(0)
      if (newBalance !== balance) {
        setBalance(newBalance)
      }
    }
    if (account && chainId) {
      void pollBalance()
    }
  }, BLOCK_TIME)

  return balance
}

export function usePoolTokenBalances(
  poolName: PoolName,
): { [token: string]: BigNumber } | null {
  const tbtcTokenBalance = useTokenBalance(WXDAI)
  const wtcTokenBalance = useTokenBalance(USDC)
  const renbtcTokenBalance = useTokenBalance(BSC_DAI)
  const sbtcTokenBalance = useTokenBalance(BSC_USDC)
  const btcPoolTokenBalances = useMemo(
    () => ({
      [WXDAI.symbol]: tbtcTokenBalance,
      [USDC.symbol]: wtcTokenBalance,
      [BSC_DAI.symbol]: renbtcTokenBalance,
      [BSC_USDC.symbol]: sbtcTokenBalance,
    }),
    [tbtcTokenBalance, wtcTokenBalance, renbtcTokenBalance, sbtcTokenBalance],
  )

  if (poolName === STABLECOIN_POOL_NAME) {
    return btcPoolTokenBalances
  }
  return null
}
