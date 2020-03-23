import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DISHES } from '../shared/dishes';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  //dishes= DISHES;
  //dishdetail = DISHES[0];

  dishes: Dish[] = DISHES;

  selectedDish: Dish;

  onSelect(dish: Dish) {
    this.selectedDish = dish;
  }
}

