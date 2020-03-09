import {
  Component,
  OnInit,
  HostListener
} from "@angular/core";
import { FormGroup, Validators, FormControl } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../account/auth.service";
import { environment } from "src/environments/environment";
import { CartService } from "../cart/cart.service";
import { CartItem } from "../cart/cart-item.model";
import { Router } from "@angular/router";

declare var StripeCheckout: StripeCheckoutStatic;

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  checkoutItems: CartItem[] = [];
  cartTotal: number;
  private userEmail: string;

  private handler: StripeCheckoutHandler;
  private confirmation: any;
  isLoading = true;
  isFormLoading = true;
  isCartItemsLoading = true;
  errorMsg: string;
  mobileMode: boolean;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkoutForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      contactNumber: new FormControl(null, [Validators.required]),
      deliveryAddress: new FormControl(null, [Validators.required])
    });

    this.handler = StripeCheckout.configure({
      key: "pk_test_nWfa8D4fer4RmSrVkunI3fKa00djvxe5pi",
      image:
        "https://d29fhpw069ctt2.cloudfront.net/icon/image/120743/preview.svg",
      locale: "auto",
      currency: "PHP",
      token: token => {
        this.isLoading = true;
        const userId = this.authService.getUserId();
        const trimmed = this.checkoutItems.map(obj => ({
          productId: obj.productId,
          quantity: obj.quantity
        }));

        this.httpClient
          .post(environment.apiUrl + "/api/billing/checkout", {
            userId: userId,
            checkoutForm: this.checkoutForm.value,
            items: trimmed,
            stripeToken: token.id
          })
          .subscribe(
            res => {
              window.scrollTo({ top: 0 });
              this.isLoading = false;
              this.cartService.getCartByUserId(userId, 'checkout');
              this.router.navigate(['/account/orders']);
              window.scrollTo({ top: 0 });
            },
            err => {
              this.isLoading = false;
              this.errorMsg = err.error.message;
            }
          );
      }
    });

    this.httpClient
      .get<{
        success: string;
        result: {
          userId: number;
          firstName: string;
          lastName: string;
          email: string;
          contactNumber: string;
          deliveryAddress: string;
        }[];
      }>(
        environment.apiUrl +
          "/api/users/" +
          this.authService.getUserId() +
          "/info"
      )
      .subscribe(res => {
        const userInfo = res.result[0];

        if (res.result[0]) {
          this.checkoutForm.get("firstName").setValue(userInfo.firstName);
          this.checkoutForm.get("lastName").setValue(userInfo.lastName);
          this.checkoutForm.get("email").setValue(userInfo.email);
          this.checkoutForm
            .get("contactNumber")
            .setValue(userInfo.contactNumber);
          this.checkoutForm
            .get("deliveryAddress")
            .setValue(userInfo.deliveryAddress);
        }
        this.isFormLoading = false;
        this.isLoading = false;
      });

    this.httpClient
      .get<{ success: string; cartItems: CartItem[] }>(
        environment.apiUrl + "/api/cart/" + this.authService.getUserId()
      )
      .subscribe(res => {
        this.checkoutItems = res.cartItems;
        this.isCartItemsLoading = false;
      });

    this.cartService
      .getCartTotal(this.authService.getUserId())
      .subscribe(res => {
        this.cartTotal = res.cartTotal * 100;
      });

    this.cartService.cartUpdated.subscribe(res => {
      if (res.length === 0 && this.router.url === "/checkout") {
        // leave checkout page if cart is empty
        this.router.navigate(["/products"]);
      }

      this.checkoutItems = res;
      this.cartService
        .getCartTotal(this.authService.getUserId())
        .subscribe(res => {
          this.cartTotal = res.cartTotal * 100;
        });
    });
  }

  onSubmit() {

    this.cartService
      .getCartTotal(this.authService.getUserId())
      .subscribe(res => {
        this.cartTotal = res.cartTotal * 100;
      });
    this.handler.open({
      name: "eBayung",
      description: "Stripe Payment Gateway",
      email: "support@ebayung.ph",
      amount: this.cartTotal
    });
  }
}
