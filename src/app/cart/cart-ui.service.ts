import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from '../account/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartUiService {
  isCartOpen = false;
  cartToggled = new Subject<boolean>();
  htmlTag = document.documentElement;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  getCartDrawerStatus() {
    return this.isCartOpen;
  }

  toggleCart() {
    if (this.authService.getAuthStatus()) {
      this.isCartOpen = !this.isCartOpen;
      this.cartToggled.next(this.isCartOpen);

      if (this.isCartOpen) {
        this.htmlTag.classList.add("scrolling-disabled");
      } else {
        this.htmlTag.classList.remove("scrolling-disabled");
      }
    } else {
      if (!this.route.snapshot.queryParamMap['params'].redirectUrl) {
        const trimmedUrl = this.router.url.includes("?") ? this.router.url.substring(0, this.router.url.indexOf("?")) : this.router.url;

        this.router.navigate(["/account/login"], {
          queryParams: {
            redirectUrl: trimmedUrl === '/account/login' ? '' : trimmedUrl
          }
        });

        window.scrollTo({ top: 0 });
      }
    }
  }
}
