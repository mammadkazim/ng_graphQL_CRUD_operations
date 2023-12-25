import { gql } from 'apollo-angular';

export const GET_FRUITS = gql`
  query {
    allFruits {
      id
      name
      quantity
      price
    }
  }
`;
export const FILTER_FRUITS_BY_ID = gql`
  query ($fruitFilter: FruitFilter) {
    allFruits(filter: $fruitFilter) {
      id
      name
      quantity
      price
    }
  }
`;
