import React, { useCallback, useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Remote } from '@core'
import { SBPaymentMethodType } from '@core/network/api/simpleBuy/types'
import { ExtractSuccess, RemoteDataType, SBPaymentTypes, WalletFiatType } from '@core/types'
import { EnterAmount, FlyoutOopsError } from 'components/Flyout'
import { getDefaultMethod } from 'components/Flyout/model'
import { maximumAmount } from 'components/Flyout/validation'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  AddBankStepType,
  BankDWStepType,
  BankPartners,
  BankTransferAccountType,
  BrokerageModalOriginType
} from 'data/types'

import { Loading, LoadingTextEnum } from '../../../../components'
import getData from './selectors'

const EnterAmountContainer = (props) => {
  useEffect(() => {
    if (props.fiatCurrency && !Remote.Success.is(props.data)) {
      props.buySellActions.fetchPaymentMethods(props.fiatCurrency)
      props.buySellActions.fetchFiatEligible(props.fiatCurrency)
      props.brokerageActions.fetchBankTransferAccounts()
      props.buySellActions.fetchSDDEligibility()
    }
  }, [props.fiatCurrency])

  const onSubmit = () => {
    if (
      props.defaultMethod &&
      'partner' in props.defaultMethod &&
      props.defaultMethod.partner === BankPartners.YAPILY
    ) {
      props.brokerageActions.setDWStep({
        dwStep: BankDWStepType.AUTHORIZE
      })
    } else {
      props.brokerageActions.setDWStep({
        dwStep: BankDWStepType.CONFIRM
      })
    }
  }

  const errorCallback = useCallback(() => {
    props.brokerageActions.setDWStep({
      dwStep: BankDWStepType.DEPOSIT_METHODS
    })
  }, [])

  const handleBack = useCallback(
    () =>
      props.brokerageActions.setDWStep({
        dwStep: BankDWStepType.DEPOSIT_METHODS
      }),
    []
  )

  const handleChangeMethod = useCallback(() => {
    props.brokerageActions.setDWStep({
      dwStep: BankDWStepType.BANK_LIST
    })
  }, [])

  const handleAddMethod = useCallback(() => {
    props.brokerageActions.showModal({
      modalType: props.fiatCurrency === 'USD' ? 'ADD_BANK_YODLEE_MODAL' : 'ADD_BANK_YAPILY_MODAL',
      origin: BrokerageModalOriginType.ADD_BANK_DEPOSIT
    })
    props.brokerageActions.setAddBankStep({
      addBankStep: AddBankStepType.ADD_BANK
    })
  }, [props.fiatCurrency])

  return props.data.cata({
    Failure: () => (
      <FlyoutOopsError
        action='retry'
        data-e2e='sbTryCurrencySelectionAgain'
        handler={errorCallback}
      />
    ),
    Loading: () => <Loading text={LoadingTextEnum.LOADING} />,
    NotAsked: () => <Loading text={LoadingTextEnum.LOADING} />,
    Success: (val) => {
      const isUserEligible =
        val.paymentMethods.methods.length &&
        val.paymentMethods.methods.find((method) => method.limits.max !== '0')
      const paymentAccount = getDefaultMethod(props.defaultMethod, val.bankTransferAccounts)
      const paymentMethod = val.paymentMethods.methods.find(
        (method) => method.type === SBPaymentTypes.BANK_TRANSFER
      )
      let handleMethodClick: () => void

      if (val.bankTransferAccounts.length > 0) {
        handleMethodClick = handleChangeMethod
      } else {
        handleMethodClick = handleAddMethod
      }

      return isUserEligible ? (
        <EnterAmount
          asyncValidate={maximumAmount(paymentMethod.limits.max)}
          onSubmit={onSubmit}
          initialValues={{ currency: props.fiatCurrency }}
          fiatCurrency={props.fiatCurrency}
          handleBack={handleBack}
          handleMethodClick={handleMethodClick}
          paymentAccount={paymentAccount}
          paymentMethod={paymentMethod}
        />
      ) : (
        <FlyoutOopsError
          action='retry'
          data-e2e='sbTryCurrencySelectionAgain'
          handler={errorCallback}
        />
      )
    }
  })
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state),
  defaultMethod: selectors.components.brokerage.getAccount(state),
  fiatCurrency: selectors.components.brokerage.getFiatCurrency(state)
})

export const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch),
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
  method: SBPaymentMethodType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>> & {
  formErrors: { amount?: 'ABOVE_MAX' | 'BELOW_MIN' | false }
}
export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
  defaultMethod: BankTransferAccountType | undefined
  fiatCurrency: WalletFiatType | undefined
}

export type Props = OwnProps & ConnectedProps<typeof connector>
export type ValidateProps = Props & SuccessStateType & LinkStatePropsType

export default connector(EnterAmountContainer)
