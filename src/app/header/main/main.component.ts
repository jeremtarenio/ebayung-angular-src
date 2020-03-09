import { Component, OnInit, OnDestroy, EventEmitter, Output } from "@angular/core";
import { CartUiService } from "src/app/cart/cart-ui.service";
import { CartService } from "src/app/cart/cart.service";
import { AuthService } from "src/app/account/auth.service";
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.css"]
})
export class MainComponent implements OnInit, OnDestroy {
  cartCount: number = 0;
  scaled: boolean;
  cartTotal;
  cartServiceSubscription: Subscription;

  constructor(
    private cartUiService: CartUiService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartServiceSubscription = this.cartService.cartUpdated.subscribe(cartItems => {
      this.scaled = true;

      setTimeout(() => {
        this.scaled = false;
      }, 300);

      let sum = 0;
      let cartTotal = 0;

      cartItems.forEach(cartItem => {
        sum += cartItem.quantity;
        cartTotal += cartItem.productPrice * cartItem.quantity;
      });

      this.cartCount = sum;
      this.cartTotal = cartTotal;
    });
  }

  ngOnDestroy(): void {
    this.cartServiceSubscription.unsubscribe();
  }

  onSearch(value) {
    this.router.navigate(['/search'], {
      queryParams: {
        q: value
      }
    });
  }

  scrollToTop() {
    window.scrollTo({ top: 0 });
  }

  onToggleCart() {
    this.cartUiService.toggleCart();
  }
}
