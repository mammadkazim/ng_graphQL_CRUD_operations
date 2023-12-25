import { Component, OnInit } from '@angular/core';
import { Fruits } from '../fruits';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FILTER_FRUITS_BY_ID, GET_FRUITS } from '../gql/fruits-query';
import { DELETE_FRUIT, UPDATE_FRUIT } from '../gql/fruits-mutation';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  fruitForm: Fruits = {
    id: 0,
    name: '',
    quantity: 0,
    price: 0,
  };
  constructor(private apollo: Apollo, private route: ActivatedRoute, private router:Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params=>{
      let id = Number(params.get('id'))
      this.getById(id)
    })
  }
  public getById(id: number) {
    this.apollo.watchQuery<{ allFruits: [Fruits] }>({
      query: FILTER_FRUITS_BY_ID,
      variables: { fruitFilter: { id } },
    }).valueChanges.subscribe(({data})=>{
      this.fruitForm = {
        id:data.allFruits[0].id,
        name:data.allFruits[0].name,
        quantity:data.allFruits[0].quantity,
        price:data.allFruits[0].price,
      }
      console.log(this.fruitForm)
    })
  }
  public updateFruit() {
    console.log(this.fruitForm,"gg")
    this.apollo
      .mutate<{ updateFruit: Fruits }>({
        mutation: UPDATE_FRUIT,
        variables: {
          id: this.fruitForm.id,
          nme: this.fruitForm.name,
          qty: this.fruitForm.quantity,
          prc: this.fruitForm.price,
        },
        // here is the another method for seeing new added element without updating the page and without querying
        update: (store, { data }) => {
          if (data?.updateFruit) {
            let oldData = store.readQuery<{ allFruits: Fruits[] }>({
              query: GET_FRUITS,
            });
            if (oldData && oldData.allFruits.length) {
              let newData = oldData.allFruits.filter(fruit=>fruit.id !== data.updateFruit.id)
              newData.unshift(data.updateFruit)

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
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

}
