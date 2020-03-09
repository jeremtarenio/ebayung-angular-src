import { Component, OnInit, HostListener, OnDestroy } from "@angular/core";
import { AuthService } from "../account/auth.service";
import { CartService } from "../cart/cart.service";
import { CartUiService } from "../cart/cart-ui.service";
import { HeaderMobileService } from "../header-mobile/header-mobile.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  firstLayerHidden = false;
  isLoggedIn = false;
  isAddedMsgVisible = false;
  productName;
  timer = null;
  navOpened = false;
  headerMobileServiceSubscription: Subscription;
  authServiceSubscription: Subscription;
  cartServiceSubscription: Subscription;
  cartUiServiceSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private cartUiService: CartUiService,
    private headerMobileService: HeaderMobileService
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.getAuthStatus();
    this.headerMobileServiceSubscription = this.headerMobileService.navToggled.subscribe(
      res => {
        this.navOpened = res;
      }
    );

    this.authServiceSubscription = this.authService
      .getAuthListener()
      .subscribe(status => {
        this.isLoggedIn = status;
      });

    this.cartServiceSubscription = this.cartService.addedToCart.subscribe(
      res => {
        if (this.timer) {
          clearTimeout(this.timer); // reset the msg timer if it's active
          this.timer = null;
        }

        if (res) {
          this.isAddedMsgVisible = true;
          this.productName = res;

          this.timer = setTimeout(() => {
            this.isAddedMsgVisible = false;
          }, 4000);
        }
      }
    );

    this.cartUiServiceSubscription = this.cartUiService.cartToggled.subscribe(
      res => {
        this.isAddedMsgVisible = false;
      }
    );

    /* this.cartService. */
  }

  ngOnDestroy(): void {
    this.headerMobileServiceSubscription.unsubscribe();
    this.authServiceSubscription.unsubscribe();
    this.cartServiceSubscription.unsubscribe();
    this.cartUiServiceSubscription.unsubscribe();
  }

  hideAddMsg() {
    this.isAddedMsgVisible = false;
  }

  @HostListener("window:scroll", ["$event"])
  doSomething(event) {
    if (window.pageYOffset >= 19) {
      this.firstLayerHidden = true;
    } else {
      this.firstLayerHidden = false;
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
