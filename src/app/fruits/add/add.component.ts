import { Component } from '@angular/core';
import { Fruits } from '../fruits';
import { Apollo } from 'apollo-angular';
import { CREATE_FRUIT } from '../gql/fruits-mutation';
import { Router } from '@angular/router';
import { GET_FRUITS } from '../gql/fruits-query';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent {
  fruitForm: Fruits = {
    id: 0,
    name: '',
    quantity: 0,
    price: 0,
  };
  constructor(private apollo: Apollo, private router: Router) {}

  public createFruit() {
    this.apollo
      .mutate<{ createFruit: Fruits }>({
        mutation: CREATE_FRUIT,
        variables: {
          nme: this.fruitForm.name,
          qty: this.fruitForm.quantity,
          prc: this.fruitForm.price,
        },
        // here is the another method for seeing new added element without updating the page and without querying
        update: (store, { data }) => {
          if (data?.createFruit) {
            let oldData = store.readQuery<{ allFruits: Fruits[] }>({
              query: GET_FRUITS,
            });
            if (oldData) {
              let newData = [data.createFruit, ...oldData.allFruits];
              store.writeQuery<{ allFruits: Fruits[] }>({
                query: GET_FRUITS,
                data: {
                  allFruits: newData,
                },
              });
            }
          }
        },
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => console.log(error, 'error n'),
      });
  }
}