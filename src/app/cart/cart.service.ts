import { Injectable } from '@angular/core';
import { CartItem } from './cart-item.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthService } from '../account/auth.service';
import { CartUiService } from './cart-ui.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: CartItem[] = [];
  cartUpdated = new Subject<CartItem[]>();
  addedToCart = new Subject<string>();

  constructor(private httpClient: HttpClient, private authService: AuthService, private cartUiService: CartUiService) { }

  getCart() {
    return this.cart;
  }

  getCartByUserId(userId: number, productName: string) {
    this.httpClient.get<{ success: string; cartItems: CartItem[] }>(environment.apiUrl + '/api/cart/' + userId).subscribe(response => {
      this.cart = response.cartItems;
      this.cartUpdated.next(response.cartItems);
      this.addedToCart.next(productName);
    });
  }

  addToCart(operator: string, userId: number, productId: number, quantity: number, productName: string) {
    this.httpClient.post<{ cartExists: boolean }>(environment.apiUrl + '/api/cart/verify/check-cart-item-exists', { userId: userId, productId: productId }).subscribe(response => {
      if (!response.cartExists) { // create new cart item (post)
        this.httpClient.post(environment.apiUrl + '/api/cart', { userId: userId, productId: productId, quantity: quantity }).subscribe(response => {
          this.getCartByUserId(userId, productName);
        }, error => {
          /* console.log(error); */
        });
      } else { // update cart item (patch)
        this.httpClient.patch(environment.apiUrl + '/api/cart', { operator: operator, userId: userId, productId: productId, quantity: quantity }).subscribe(response => {
          this.getCartByUserId(userId, productName);
        }, error => {
          /* console.log(error); */
        });
      }


    });
  }

  getCartTotal(userId: number) {
    return this.httpClient.get<{ success: string; cartTotal: number }>(environment.apiUrl + '/api/cart/total/' + userId);
  }

  deleteCartItem(userId: number, productId: number) {
    return this.httpClient.delete<{ success: string; message: CartItem[] }>(environment.apiUrl + '/api/cart/' + userId + '/' + productId);
  }

  decrementQuantity(userId: number, productId: number) {
    return this.httpClient.patch<{ success: string; message: string }>(environment.apiUrl + '/api/cart', { operator: "-", userId: userId, productId: productId, quantity: 1 });
  }

  incrementQuantity(userId: number, productId: number) {
    return this.httpClient.patch<{ success: string; message: string }>(environment.apiUrl + '/api/cart', { operator: "+", userId: userId, productId: productId, quantity: 1 });
  }
}
