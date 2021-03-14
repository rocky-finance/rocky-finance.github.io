import React, { ReactElement } from "react"
import StakePage from "../components/StakePage"

import TopMenu from "../components/TopMenu"
import { useTranslation } from "react-i18next"

function Stake(): ReactElement {
  const { t } = useTranslation()

  return (
    <div className="stakepage">
      <TopMenu activeTab={t("stake")} />
      <StakePage />
    </div>
  )
}

export default Stake
