import React from 'react';
import { categories } from '../../utils/categories';
import { Container, Title, Amount, Footer, Category, Icon, CategoryName, Date } from './styles';

interface CategoryInterface {
  name: string;
  icon: string;
}

export interface TransactionCardProps {
  name: string;
  amount: string;
  category: string;
  date: string;
  type: 'up' | 'down';
}

interface Props {
  data: TransactionCardProps;
}

export function TransactionCard({ data }: Props) {
  const { name, amount, category, date, type } = data;

  const [categoryFiltred] = categories.filter((item) => item.key === category);

  return (
    <Container>
      <Title>{name}</Title>
      <Amount type={type}>
        {type === 'down' && '- '}
        {amount}
      </Amount>

      <Footer>
        <Category>
          <Icon name={categoryFiltred.icon} />
          <CategoryName>{categoryFiltred.name}</CategoryName>
        </Category>

        <Date>{date}</Date>
      </Footer>
    </Container>
  );
}
