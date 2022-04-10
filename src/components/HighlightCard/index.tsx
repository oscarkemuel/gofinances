import React from 'react';
import { Container, Header, Title, Icon, Footer, Amount, LastTransaction } from './styles';

interface Props {
  type: 'up' | 'down' | 'total';
  amount: string;
  lastTransaction: string;
}

const iconByType = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
  total: 'dollar-sign',
};

const titleByType = {
  up: 'Entradas',
  down: 'Saídas',
  total: 'Total',
};

export function HighlightCard({ amount, lastTransaction, type }: Props) {
  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{titleByType[type]}</Title>
        <Icon name={iconByType[type]} type={type} />
      </Header>

      <Footer>
        <Amount type={type}>{amount}</Amount>
        <LastTransaction type={type}>{lastTransaction}</LastTransaction>
      </Footer>
    </Container>
  );
}
