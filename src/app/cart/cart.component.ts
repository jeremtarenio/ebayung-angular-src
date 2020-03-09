import { Component, OnInit, OnDestroy } from "@angular/core";
import { CartUiService } from "./cart-ui.service";
import { CartItem } from "./cart-item.model";
import { CartService } from "./cart.service";
import { AuthService } from "../account/auth.service";
import { Subscription } from 'rxjs';

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"]
})
export class CartComponent implements OnInit, OnDestroy {

  cartOpen = false;
  amount = 1;
  cartItems: CartItem[] = [];
  deleteCartItemLoading = false;
  cartTotal;
  authServiceSubscription: Subscription;
  cartServiceSubscription: Subscription;
  cartUiServiceSubscription: Subscription;
  checkOutButtonDisabled: boolean = true;

  constructor(
    private cartUiService: CartUiService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (this.authService.getUserId()) {
      this.cartService.getCartByUserId(this.authService.getUserId(), null);
    }

    this.authServiceSubscription = this.authService.getAuthListener().subscribe(response => {
      if (response) {
        this.cartService.getCartByUserId(this.authService.getUserId(), null);
        this.checkOutButtonDisabled = false;
      } else {
        this.cartItems = [];
        this.checkOutButtonDisabled = true;
      }
    });

    this.cartServiceSubscription = this.cartService.cartUpdated.subscribe(cartItems => {
      if (cartItems.length === 0) {
        this.checkOutButtonDisabled = true;
      } else {
        this.checkOutButtonDisabled = false;
      }
      this.cartService
        .getCartTotal(this.authService.getUserId())
        .subscribe(res => {
          this.cartTotal = res.cartTotal;
          this.cartItems = cartItems;
          this.deleteCartItemLoading = false;
        });
    });

    this.cartUiServiceSubscription = this.cartUiService.cartToggled.subscribe(status => {
      this.cartOpen = status;
    });
  }

  ngOnDestroy(): void {
    this.authServiceSubscription.unsubscribe();
    this.cartServiceSubscription.unsubscribe();
    this.cartUiServiceSubscription.unsubscribe();
  }

  onDeleteCartItem(productId: number) {
    this.deleteCartItemLoading = true;
    const userId = this.authService.getUserId();

    this.cartService.deleteCartItem(userId, productId).subscribe(response => {
      this.cartService.getCartByUserId(userId, null);
    });
  }

  onDecrementQuantity(productId: number) {
    this.deleteCartItemLoading = true;
    const userId = this.authService.getUserId();

    this.cartService
      .decrementQuantity(userId, productId)
      .subscribe(response => {
        this.cartService.getCartByUserId(userId, null);
      });
  }

  onIncrementQuantity(productId: number) {
    this.deleteCartItemLoading = true;
    const userId = this.authService.getUserId();

    this.cartService
      .incrementQuantity(userId, productId)
      .subscribe(response => {
        this.cartService.getCartByUserId(userId, null);
      });
  }

  computeItemPrice(price, quantity) {
    return Math.round(((price * quantity) + Number.EPSILON) * 100) / 100;
  }

  onToggleCart() {
    this.cartUiService.toggleCart();
  }

  onCheckout() {
    window.scrollTo({ top: 0 });
    this.onToggleCart();
  }

  onIncrementAmount() {}

  onDecrementAmount() {}

  onChange() {}
}
