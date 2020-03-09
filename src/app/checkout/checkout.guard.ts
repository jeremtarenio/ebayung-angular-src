import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute
} from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { CartService } from "../cart/cart.service";

@Injectable()
export class CheckoutGuard implements CanActivate {
  constructor(private router: Router, private cartService: CartService, private route: ActivatedRoute) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const cart = this.cartService.getCart();
    let isCartEmpty = false;

    if (cart.length === 0) {
      isCartEmpty = true;
      this.router.navigate(['/']);
    }

    return !isCartEmpty; // do not proceed if user is NOT logged in
  }
}
