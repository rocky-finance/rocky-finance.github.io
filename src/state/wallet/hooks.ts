import { BLOCK_TIME, Token } from "../../constants"
import { BSC_DAI, BSC_USDC, USDC, WXDAI } from "../../constants"
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
    } else {
      setBalance(BigNumber.from(0))
    }
  }, BLOCK_TIME)

  return balance
}

export function useStablePoolTokenBalances(): { [token: string]: BigNumber } {
  const wxdaiTokenBalance = useTokenBalance(WXDAI)
  const usdcTokenBalance = useTokenBalance(USDC)
  const bscdaiTokenBalance = useTokenBalance(BSC_DAI)
  const bscusdcTokenBalance = useTokenBalance(BSC_USDC)
  const stablePoolTokenBalances = useMemo(
    () => ({
      [WXDAI.symbol]: wxdaiTokenBalance,
      [USDC.symbol]: usdcTokenBalance,
      [BSC_DAI.symbol]: bscdaiTokenBalance,
      [BSC_USDC.symbol]: bscusdcTokenBalance,
    }),
    [
      wxdaiTokenBalance,
      usdcTokenBalance,
      bscdaiTokenBalance,
      bscusdcTokenBalance,
    ],
  )

  return stablePoolTokenBalances
}
