import React, { ReactElement, useEffect, useState } from "react"
import {
  STABLECOIN_POOL_NAME,
  STABLECOIN_POOL_TOKENS,
  STABLECOIN_SWAP_TOKEN,
} from "../constants"
import { TokensStateType, useTokenFormState } from "../hooks/useTokenFormState"
import { formatBNToString, shiftBNDecimals } from "../utils"
import usePoolData, { PoolDataType } from "../hooks/usePoolData"
import { AppState } from "../state"
import { BigNumber } from "@ethersproject/bignumber"
import DepositPage from "../components/DepositPage"
import { DepositTransaction } from "../interfaces/transactions"
import { TokenPricesUSD } from "../state/application"
import { TransactionItem } from "../interfaces/transactions"
import { Zero } from "@ethersproject/constants"
import { calculatePriceImpact } from "../utils/priceImpact"
import { parseUnits } from "@ethersproject/units"
import { useActiveWeb3React } from "../hooks"
import { useApproveAndDeposit } from "../hooks/useApproveAndDeposit"
import { useSelector } from "react-redux"
import { useStablePoolTokenBalances } from "../state/wallet/hooks"
import { useSwapContract } from "../hooks/useContract"

function DepositStable(): ReactElement | null {
  const { account } = useActiveWeb3React()
  const approveAndDeposit = useApproveAndDeposit(STABLECOIN_POOL_NAME)
  const [poolData, userShareData] = usePoolData(STABLECOIN_POOL_NAME)
  const swapContract = useSwapContract(STABLECOIN_POOL_NAME)
  const [tokenFormState, updateTokenFormState] = useTokenFormState(
    STABLECOIN_POOL_TOKENS,
  )
  const tokenBalances = useStablePoolTokenBalances()
  const { tokenPricesUSD } = useSelector((state: AppState) => state.application)
  const [estDepositLPTokenAmount, setEstDepositLPTokenAmount] = useState(Zero)
  const [priceImpact, setPriceImpact] = useState(Zero)

  useEffect(() => {
    // evaluate if a new deposit will exceed the pool's per-user limit
    async function calculateMaxDeposits(): Promise<void> {
      if (
        swapContract == null ||
        userShareData == null ||
        poolData == null ||
        account == null
      ) {
        setEstDepositLPTokenAmount(Zero)
        return
      }
      const tokenInputSum = parseUnits(
        STABLECOIN_POOL_TOKENS.reduce(
          (sum, { symbol }) => sum + (+tokenFormState[symbol].valueRaw || 0),
          0,
        ).toFixed(18),
        18,
      )
      let depositLPTokenAmount
      if (poolData.totalLocked.gt(0) && tokenInputSum.gt(0)) {
        depositLPTokenAmount = await swapContract.calculateTokenAmount(
          account,
          STABLECOIN_POOL_TOKENS.map(
            ({ symbol }) => tokenFormState[symbol].valueSafe,
          ),
          true, // deposit boolean
        )
      } else {
        // when pool is empty, estimate the lptokens by just summing the input instead of calling contract
        depositLPTokenAmount = tokenInputSum
      }
      setEstDepositLPTokenAmount(depositLPTokenAmount)

      setPriceImpact(
        calculatePriceImpact(
          tokenInputSum,
          depositLPTokenAmount,
          poolData.virtualPrice,
        ),
      )
    }
    void calculateMaxDeposits()
  }, [poolData, tokenFormState, swapContract, userShareData, account])

  // A represention of tokens used for UI
  const tokens = STABLECOIN_POOL_TOKENS.map(
    ({ symbol, name, icon, decimals }) => ({
      symbol,
      name,
      icon,
      max: formatBNToString(tokenBalances[symbol], decimals),
      isZeroBalance: tokenBalances[symbol].isZero(),
      inputValue: tokenFormState[symbol].valueRaw,
    }),
  )

  const exceedsWallet = (symbol: string) =>
    tokenBalances[symbol].lt(BigNumber.from(tokenFormState[symbol].valueSafe))

  async function onConfirmTransaction(): Promise<void> {
    await approveAndDeposit(tokenFormState)
    // Clear input after deposit
    updateTokenFormState(
      STABLECOIN_POOL_TOKENS.reduce(
        (acc, t) => ({
          ...acc,
          [t.symbol]: "",
        }),
        {},
      ),
    )
  }

  function updateTokenFormValue(symbol: string, value: string): void {
    updateTokenFormState({ [symbol]: value })
  }

  const depositTransaction = buildTransactionData(
    tokenFormState,
    poolData,
    priceImpact,
    estDepositLPTokenAmount,
    tokenPricesUSD,
  )

  const canDeposit =
    !STABLECOIN_POOL_TOKENS.some(({ symbol }) => {
      const exceedsBoolean = tokenBalances[symbol].lt(
        BigNumber.from(tokenFormState[symbol].valueSafe),
      )
      return exceedsBoolean
    }) && depositTransaction.to.totalAmount.gt(0)

  return (
    <DepositPage
      onConfirmTransaction={onConfirmTransaction}
      onChangeTokenInputValue={updateTokenFormValue}
      title="BTC Pool"
      tokens={tokens}
      exceedsWallet={exceedsWallet}
      poolData={poolData}
      historicalPoolData={null}
      myShareData={userShareData}
      transactionData={depositTransaction}
      canDeposit={canDeposit}
    />
  )
}

function buildTransactionData(
  tokenFormState: TokensStateType,
  poolData: PoolDataType | null,
  priceImpact: BigNumber,
  estDepositLPTokenAmount: BigNumber,
  tokenPricesUSD?: TokenPricesUSD,
): DepositTransaction {
  const from = {
    items: [] as TransactionItem[],
    totalAmount: Zero,
    totalValueUSD: Zero,
  }
  const TOTAL_AMOUNT_DECIMALS = 18
  STABLECOIN_POOL_TOKENS.forEach((token) => {
    const { symbol, decimals } = token
    const amount = BigNumber.from(tokenFormState[symbol].valueSafe)
    const usdPriceBN = parseUnits(
      (tokenPricesUSD?.[symbol] || 0).toFixed(2),
      18,
    )
    if (amount.lte("0")) return
    const item = {
      token,
      amount,
      singleTokenPriceUSD: usdPriceBN,
      valueUSD: amount.mul(usdPriceBN).div(BigNumber.from(10).pow(decimals)),
    }
    from.items.push(item)
    from.totalAmount = from.totalAmount.add(
      shiftBNDecimals(amount, TOTAL_AMOUNT_DECIMALS - decimals),
    )
    from.totalValueUSD = from.totalValueUSD.add(usdPriceBN)
  })

  const lpTokenPriceUSD = poolData?.lpTokenPriceUSD || Zero
  const toTotalValueUSD = estDepositLPTokenAmount
    .mul(lpTokenPriceUSD)
    ?.div(BigNumber.from(10).pow(STABLECOIN_SWAP_TOKEN.decimals))
  const to = {
    item: {
      token: STABLECOIN_SWAP_TOKEN,
      amount: estDepositLPTokenAmount,
      singleTokenPriceUSD: lpTokenPriceUSD,
      valueUSD: toTotalValueUSD,
    },
    totalAmount: estDepositLPTokenAmount,
    totalValueUSD: toTotalValueUSD,
  }
  const shareOfPool = poolData?.totalLocked.gt(0)
    ? estDepositLPTokenAmount
        .mul(BigNumber.from(10).pow(18))
        .div(estDepositLPTokenAmount.add(poolData?.totalLocked))
    : BigNumber.from(10).pow(18)
  return {
    from,
    to,
    priceImpact,
    shareOfPool,
  }
}

export default DepositStable
