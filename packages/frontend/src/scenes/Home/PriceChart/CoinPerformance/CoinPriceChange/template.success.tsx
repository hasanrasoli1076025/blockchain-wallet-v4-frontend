import React from 'react'
import styled from 'styled-components'

import { PriceChangeType } from '@core/redux/data/misc/types'
import { PriceChange } from 'scenes/Transactions/model'
import { media } from 'services/styles'

import { Props as OwnProps, SuccessStateType } from '.'

const Wrapper = styled.div`
  margin-top: 8px;
  margin-left: 0;

  ${media.atLeastTabletL`
    margin-left: 24px;
  `}
`

const Success = ({ currency, priceChange }: Props) => {
  return (
    <Wrapper>
      <PriceChange currency={currency} priceChange={priceChange}>
        {' '}
      </PriceChange>
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType & { priceChange: PriceChangeType }

export default Success
