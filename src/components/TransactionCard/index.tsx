import React from 'react';
import { Container, Title, Amount, Footer, Category, Icon, CategoryName, Date } from './styles';

interface CategoryInterface {
  name: string;
  icon: string;
}

export interface TransactionCardProps {
  title: string;
  amount: string;
  category: CategoryInterface;
  date: string;
  type: 'up' | 'down';
}

interface Props {
  data: TransactionCardProps;
}

export function TransactionCard({ data }: Props) {
  const { title, amount, category, date, type } = data;

  return (
    <Container>
      <Title>{title}</Title>
      <Amount type={type}>
        {type === 'down' && '- '}
        {amount}
      </Amount>

      <Footer>
        <Category>
          <Icon name={category.icon} />
          <CategoryName>{category.name}</CategoryName>
        </Category>

        <Date>{date}</Date>
      </Footer>
    </Container>
  );
}
