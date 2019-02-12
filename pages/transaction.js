import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Card, { CardHeader } from '../components/Card'
import Tag from '../components/Tag'
import Icon from '../components/Icon'
import styled from 'styled-components'
import Table from '../components/Table'
import Link from 'next/link'
import { truncateId } from '../utils/truncate'
import { getTransactionById } from '../services/transactionService'
import getConfig from 'next/config'
import Moment from 'moment'
const { publicRuntimeConfig } = getConfig()
const { ETHERSCAN_URL } = publicRuntimeConfig
const Container = styled.div`
  max-width: 1200px;
  margin: 50px auto 0 auto;
  i {
    vertical-align: middle;
  }
`
const CardContent = styled.div`
  display: flex;
  padding: 30px;
  overflow: auto;
  @media screen and (max-width: 600px) {
    width: 1000px;
  }
  > div {
    flex: 1 1 auto;
  }
  table {
    text-align: left;
    font-size: 14px;
    th:last-child,
    td:last-child {
      text-align: right;
    }
    th:first-child,
    td:first-child {
      width: 70%;
      text-align: left;
    }
    td > div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`
const TopContainer = styled.div`
  margin-bottom: 50px;
  > h1 {
    font-family: Circular, Arial, sans-serif;
  }
  h2 {
    font-size: 34px;
    margin-top: 15px;
    margin-bottom: 5px;
    i {
      color: ${props => props.theme.colors.B100};
      vertical-align: middle;
      font-size: 18px;
    }
    span {
      vertical-align: middle;
    }
  }
`
const SmallTxText = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.B100};
  margin-bottom: 20px;
  @media screen and (max-width: 600px) {
    font-size: 9px;
  }
`
const ArrowContainer = styled.div`
  text-align: center;
  width: 150px;
  flex: 0 0 100px;
  font-size: 24px;
  color: ${props => props.theme.colors.B100};
  position: relative;
  i {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    right: 0;
    margin: 0 auto;
  }
`
const FooterContainer = styled.div`
  margin-top: 40px;
  font-size: 14px;
  display: flex;
  > div:not(:last-child) {
    margin-right: 30px;
  }
  div:last-child {
    margin-left: auto;
  }
  span {
    vertical-align: middle;
  }
`
const StyledCardHeader = styled(CardHeader)`
  font-size: 18px;
  span {
    font-weight: 900;
  }
`
const Error = styled.div`
  font-size: calc(32px + 1.5vw);
  text-align: center;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
`
const columns = [
  {
    key: 'address',
    value: 'address'
  },
  {
    key: 'amount',
    value: 'amount'
  }
]
export default class transaction extends Component {
  static propTypes = {
    tx: PropTypes.object,
    error: PropTypes.any,
    success: PropTypes.bool,
    etherscanUrl: PropTypes.string
  }
  static async getInitialProps (context) {
    try {
      const { data, success, error } = await getTransactionById(context.query.id)
      console.log(process.env)
      return {
        tx: data,
        success: success,
        error: error.description
      }
    } catch (error) {
      return { error: 'something is wrong!' }
    }
  }

  renderTableCard () {
    return (
      <Card>
        <StyledCardHeader>
          Transferred{' '}
          {this.props.tx.inputs.map((input, index) => (
            <span key={index}>
              {input.amount} {input.token_symbol}
            </span>
          ))}
        </StyledCardHeader>
        <div style={{ overflow: 'auto' }}>
          <CardContent>
            <div>
              <h4>From</h4>
              <Table
                columns={columns}
                dataSource={this.props.tx.inputs.map(io => ({
                  key: io.owner,
                  address: (
                    <Link as={`/address/${io.owner}`} href={`/address?id=${io.owner}`} prefetch>
                      <a>{io.owner}</a>
                    </Link>
                  ),
                  amount: `${io.amount} ${io.token_symbol}`
                }))}
              />
            </div>
            <ArrowContainer>
              <Icon name='Arrow-Right' />
            </ArrowContainer>
            <div>
              <h4>To</h4>
              <Table
                columns={columns}
                dataSource={this.props.tx.outputs.map(io => ({
                  key: io.owner,
                  address: (
                    <Link as={`/address/${io.owner}`} href={`/address?id=${io.owner}`} prefetch>
                      <a>{io.owner}</a>
                    </Link>
                  ),
                  amount: `${io.amount} ${io.token_symbol}`
                }))}
              />
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }
  renderTransactionHeader () {
    return (
      <TopContainer>
        <h1>Transaction</h1>
        <h2>
          <span>{truncateId(this.props.tx.txid)}</span>
        </h2>
        <SmallTxText>{this.props.tx.txid}</SmallTxText>
        <Tag>SUCCESS</Tag>
      </TopContainer>
    )
  }
  renderFooter () {
    return (
      <FooterContainer>
        <div>
          <Icon name='Token' />{' '}
          <span>
            OMG Block height{' '}
            <Link href='/' prefetch>
              <a>{this.props.tx.txblknum}</a>
            </Link>
          </span>
        </div>
        <div>
          <Icon name='Token' />{' '}
          <span>
            Ethereum Block height{' '}
            <Link href={`${ETHERSCAN_URL}block/${this.props.tx.eth_height}`}>
              <a target='_blank'>{this.props.tx.eth_height}</a>
            </Link>
          </span>
        </div>
        <div>
          <Icon name='Time' />
          <span>
            {' '}
            {Moment(this.props.tx.timestamp).fromNow()}
            {' | '}
            {Moment(this.props.tx.timestamp).format('HH:MM:SS A | MMMM DD[,] YYYY')}
          </span>
        </div>
      </FooterContainer>
    )
  }

  render () {
    return (
      <Container>
        {this.props.success ? (
          <Fragment>
            {this.renderTransactionHeader()}
            {this.renderTableCard()}
            {this.renderFooter()}
          </Fragment>
        ) : (
          <Error>{this.props.error}</Error>
        )}
      </Container>
    )
  }
}
