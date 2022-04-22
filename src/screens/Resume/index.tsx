/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import {
  Container,
  Header,
  Title,
  Content,
  ChartContaienr,
  MonthSelect,
  SelectIcon,
  Month,
  LoadContainer,
} from './styles';

import { useFormat } from '../../utils/numberFormat';
import { HistoryCard } from '../../components/HistoryCard';
import { DataListProps } from '../Dashboard';
import { categories } from '../../utils/categories';
import { BorderlessButton } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const dataKey = '@gofinances:transactions';

interface CategoryData {
  name: string;
  color: string;
  totalFormated: string;
  total: number;
  key: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

  const { formatNumberToReal } = useFormat();
  const theme = useTheme();
  const bottomTabBarHeight = useBottomTabBarHeight();

  function handleDateChange(action: 'next' | 'previous') {
    let newDate: Date;

    if (action === 'next') {
      newDate = addMonths(selectedDate, 1);
    } else {
      newDate = subMonths(selectedDate, 1);
    }

    setSelectedDate(newDate);
  }

  async function laodDate() {
    setIsLoading(true);
    const response = await AsyncStorage.getItem(dataKey);
    const responseData: DataListProps[] = response ? JSON.parse(response) : [];

    const expensives = responseData.filter(
      (expensive) =>
        expensive.type === 'down' &&
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear(),
    );

    const expensivesTotal = expensives.reduce((acumulator, expensive) => {
      return acumulator + Number(expensive.amount);
    }, 0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach((category) => {
      let categorySum = 0;

      expensives.forEach((expensive) => {
        if (category.key === expensive.category) {
          categorySum += Number(expensive.amount);
        }
      });

      const percent = `${((categorySum * 100) / expensivesTotal).toFixed(0)}%`;

      if (categorySum > 0)
        totalByCategory.push({
          name: category.name,
          total: categorySum,
          totalFormated: formatNumberToReal(categorySum),
          color: category.color,
          key: category.key,
          percent,
        });
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      laodDate();
    }, [selectedDate]),
  );

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      <Content
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: bottomTabBarHeight,
        }}
        showsVerticalScrollIndicator={false}
      >
        <MonthSelect>
          <BorderlessButton onPress={() => handleDateChange('previous')}>
            <SelectIcon name="chevron-left" />
          </BorderlessButton>

          <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

          <BorderlessButton onPress={() => handleDateChange('next')}>
            <SelectIcon name="chevron-right" />
          </BorderlessButton>
        </MonthSelect>

        {isLoading ? (
          <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </LoadContainer>
        ) : (
          <>
            <ChartContaienr>
              <VictoryPie
                data={totalByCategories}
                x="percent"
                y="total"
                colorScale={totalByCategories.map((category) => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape,
                  },
                }}
                labelRadius={50}
              />
            </ChartContaienr>

            {totalByCategories.map((category) => (
              <HistoryCard
                amount={category.totalFormated}
                color={category.color}
                title={category.name}
                key={category.key}
              />
            ))}
          </>
        )}
      </Content>
    </Container>
  );
}
