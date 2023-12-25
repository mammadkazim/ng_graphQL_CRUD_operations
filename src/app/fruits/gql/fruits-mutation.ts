import { gql } from 'apollo-angular';

export const CREATE_FRUIT = gql`
  mutation ($nme: String!, $qty: Int!, $prc: Int!) {
    createFruit(name: $nme, quantity: $qty, price: $prc) {
      id
      name
      quantity
      price
    }
  }
`;
export const UPDATE_FRUIT = gql`
  mutation ($id: ID!, $nme: String!, $qty: Int!, $prc: Int!) {
    updateFruit(id: $id, name: $nme, quantity: $qty, price: $prc) {
      id
      name
      quantity
      price
    }
  }
`;
export const DELETE_FRUIT = gql`
  mutation ($id: ID!) {
    removeFruit(id: $id) {
      id
    }
  }
`;
