import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {



  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();

  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }


  addToCart(theCartItem: CartItem) {

    // check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      // Find the item in  the cart base on item id
     
      // Old Code ------------------------------------------------------------
      /*
      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }
      --------------------------------------------------------------------------
      */

      // New Refactor Code
      existingCartItem = this.cartItems.find( tempCarteItem => tempCarteItem.id === theCartItem.id);
     
      // Check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    if (alreadyExistsInCart) {
      // Incerement the quantity
      existingCartItem.quantity++;
    }

    else {
      // Just add the item to the array (cart)
      this.cartItems.push(theCartItem);
    }


    // compute cart total price and total quantity
    this.computeCartTotals();

  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);
  }


  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }


  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity --;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }


  remove(theCartItem: CartItem) {
    //get index of item in the array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id);

    // if found, remove the item from array at the given index
    if (itemIndex >-1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  



}