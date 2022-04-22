/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React, { useState, useEffect, useCallback } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LoadContainer,
} from './styles';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { useFormat } from '../../utils/numberFormat';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighLightProps {
  amount: string;
  lastTransaction: string;
}
interface HighLightData {
  entries: HighLightProps;
  expensives: HighLightProps;
  total: HighLightProps;
}

const dataKey = '@gofinances:transactions';

export function Dashboard() {
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highLightData, setHighLightData] = useState({} as HighLightData);
  const [isLoading, setIsLoading] = useState(true);

  const theme = useTheme();

  const { formatNumberToReal, formatDateMinimalBR } = useFormat();

  function getLastTransactionDate(data: DataListProps[], type: 'up' | 'down') {
    const lastTransaction = new Date(
      Math.max.apply(
        Math,
        data.filter((item) => item.type === type).map((item) => new Date(item.date).getTime()),
      ),
    );

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', {
      month: 'long',
    })}`;
  }

  async function laodTransaction() {
    const response = await AsyncStorage.getItem(dataKey);
    const data: DataListProps[] = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormated: DataListProps[] = data.map((item: DataListProps) => {
      if (item.type === 'up') {
        entriesTotal += Number(item.amount);
      } else {
        expensiveTotal += Number(item.amount);
      }

      const amount = formatNumberToReal(Number(item.amount));

      const date = formatDateMinimalBR(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      };
    });

    setTransactions(transactionsFormated);

    const total = entriesTotal - expensiveTotal;
    const lastTransactionEntries = getLastTransactionDate(data, 'up');
    const lastTransactionExpensives = getLastTransactionDate(data, 'down');
    const totalInterval = `01 a ${lastTransactionExpensives}`;

    setHighLightData({
      entries: {
        amount: formatNumberToReal(entriesTotal),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`,
      },
      expensives: {
        amount: formatNumberToReal(expensiveTotal),
        lastTransaction: `Última saída dia ${lastTransactionExpensives}`,
      },
      total: {
        amount: formatNumberToReal(total),
        lastTransaction: totalInterval,
      },
    });
    setIsLoading(false);
  }

  useEffect(() => {
    laodTransaction();
  }, []);

  useFocusEffect(
    useCallback(() => {
      laodTransaction();
    }, []),
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/34771800?v=4' }} />

                <User>
                  <UserGreeting>Olá, </UserGreeting>
                  <UserName>Oscar K.</UserName>
                </User>
              </UserInfo>

              <BorderlessButton onPress={() => Alert.alert('dejese sair?')}>
                <Icon name="power" />
              </BorderlessButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              type="up"
              amount={highLightData.entries.amount}
              lastTransaction={highLightData.entries.lastTransaction}
            />
            <HighlightCard
              type="down"
              amount={highLightData.expensives.amount}
              lastTransaction={highLightData.expensives.lastTransaction}
            />
            <HighlightCard
              type="total"
              amount={highLightData.total.amount}
              lastTransaction={highLightData.total.lastTransaction}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
