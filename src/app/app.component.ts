
import { Component, OnInit, OnDestroy } from "@angular/core";
import { ScreenService } from "./screen.service";
import { HeaderMobileService } from "./header-mobile/header-mobile.service";
import { CartUiService } from "./cart/cart-ui.service";
import { AuthService } from './account/auth.service';
import { Subscription } from 'rxjs';
import { CategoriesService } from './shared/categories.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  title = "E-Comm";
  navOpened = false;
  isMobileResolution = false;
  cartOpen = false;
  isLoading = false;

  headerMobileServiceSubscription: Subscription;
  cartUiServiceSubscription: Subscription;

  categoriesLoading = true;
  loadingPresentInDom = true;
  sprinnerPresentInDom = true;
  currentUrl: string;
  adminMode;

  constructor(
    private screenService: ScreenService,
    private headerMobileService: HeaderMobileService,
    private cartUiService: CartUiService,
    private authService: AuthService,
    private categoryService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // hides headers for users if account is admin
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.currentUrl = event.urlAfterRedirects;

        if (this.authService.getAuthStatus()) {
          this.authService.getUserInfo().subscribe(res => {
            if (res.result[0].role === 'admin' && this.currentUrl.includes('admin')) {
              this.adminMode = true;
            } else {
              this.adminMode = false;
              this.categoryService.fetchCategories();
            }
          });
        }


      }
    });

    this.categoryService.fetchCategories();
    this.isMobileResolution = this.screenService.getIsMobileResolution();
    this.authService.autoAuthUser();

    this.categoryService.loadingDone.subscribe(res => {
      this.categoriesLoading = false;
      this.sprinnerPresentInDom = false;
      setTimeout(() => {
        this.loadingPresentInDom = false;
      }, 1000);
    });

    this.headerMobileServiceSubscription = this.headerMobileService.navToggled.subscribe(n => {
      this.navOpened = n;
    });

    this.cartUiServiceSubscription = this.cartUiService.cartToggled.subscribe(cartStatus => {
      this.cartOpen = cartStatus;
    });


  }

  ngOnDestroy(): void {
    this.headerMobileServiceSubscription.unsubscribe();
    this.cartUiServiceSubscription.unsubscribe();
  }

  onToggleCart() {
    this.cartUiService.toggleCart();
  }

  /* translateXContent() {
    this.navOpened = !this.navOpened;
  } */
}
