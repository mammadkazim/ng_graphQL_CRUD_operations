import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GET_FRUITS } from '../gql/fruits-query';
import { Observable, map, of } from 'rxjs';
import { Fruits } from '../fruits';
import { DELETE_FRUIT } from '../gql/fruits-mutation';

declare var window: any
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  deledeModal:any;
  idToDelete: number
  public allFruits$: Observable<Fruits[]> = this.apollo.watchQuery<{allFruits: Fruits[]}>({
    query: GET_FRUITS, 
    // fetchPolicy:'no-cache' //when we add new fruit to see update, we can also use another method for this in add.com.ts
  }).valueChanges.pipe(
    map((result)=>result.data.allFruits)
  )
  constructor(private apollo:Apollo){}
  ngOnInit(): void {
    this.deledeModal = new window.bootstrap.Modal(document.getElementById('deleteModal'))
  }

  openModal(id:number){
    this.idToDelete = id
    this.deledeModal.show()
  }
  public deleteFruit() {
    this.apollo
      .mutate<{ removeFruit: Fruits }>({
        mutation: DELETE_FRUIT,
        variables: {
          id: this.idToDelete
        },
        // here is the another method for seeing new added element without updating the page and without querying
        update: (store, { data }) => {
          if (data?.removeFruit) {
            let oldData = store.readQuery<{ allFruits: Fruits[] }>({
              query: GET_FRUITS,
            });
            if (oldData && oldData.allFruits.length) {
              let newData = oldData.allFruits.filter(fruit=>fruit.id !== data.removeFruit.id)
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
      .subscribe(()=>{
        this.deledeModal.hide()
      });
      
  }
}
