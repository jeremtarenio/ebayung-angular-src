import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CategoriesService } from '../shared/categories.service';
import { Category } from '../shared/category.model';
import { Subject, Subscription } from 'rxjs';
import { HeaderMobileService } from './header-mobile.service';
import { AuthService } from '../account/auth.service';
import { CartUiService } from '../cart/cart-ui.service';
import { CartService } from '../cart/cart.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterByService } from '../product-list/filter-by/filter-by.service';

@Component({
  selector: "app-header-mobile",
  templateUrl: "./header-mobile.component.html",
  styleUrls: ["./header-mobile.component.css"]
})
export class HeaderMobileComponent implements OnInit, OnDestroy {
  navOpened = false;
  categories: Category[] = [];
  categoriesActive = false;
  activeCategory: Category;
  categoryClicked = false;
  activeCategoryChanged = new Subject<Category>();

  activeCategorySubscription: Subscription;
  headerMobileServiceSubscription: Subscription;
  authSubscription: Subscription;
  cartServiceSubscription: Subscription;

  userLoggedIn = false;

  cartCount: number = 0;
  scaled = false;

  isSearchActive = false;
  constructor(
    private categoriesService: CategoriesService,
    private headerMobileService: HeaderMobileService,
    private authService: AuthService,
    private cartUiService: CartUiService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private filterByService: FilterByService
  ) {
  }

  ngOnInit(): void {
    this.categoriesService.categoriesFetched.subscribe(res => {
      this.activeCategory = res[0];
      this.categories = res;
    });

    this.userLoggedIn = this.authService.getAuthStatus();

    this.authSubscription = this.authService
      .getAuthListener()
      .subscribe(res => {
        this.userLoggedIn = res;
      });

    this.activeCategorySubscription = this.activeCategoryChanged.subscribe(
      (category: Category) => {
        this.activeCategory = category;
      }
    );

    this.headerMobileServiceSubscription = this.headerMobileService.navToggled.subscribe(
      n => {
        this.navOpened = n;
      }
    );

    this.cartServiceSubscription = this.cartService.cartUpdated.subscribe(res => {
      this.scaled = true;

      setTimeout(() => {
        this.scaled = false;
      }, 300);

      let sum = 0;

      res.forEach(cartItem => {
        sum += cartItem.quantity;
      });

      this.cartCount = sum;
    });

  }

  ngOnDestroy(): void {
    this.activeCategorySubscription.unsubscribe();
    this.headerMobileServiceSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    this.cartServiceSubscription.unsubscribe();
  }

  onSearch(searchForm) {
    this.router.navigate(['/search'], {
      queryParams: {
        q: searchForm.value
      }
    });
    this.toggleSearch();
    searchForm.blur();

  }

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
  }

  onLogout() {
    this.authService.logout();
  }

  onNavigate() {
    window.scrollTo({ top: 0 });
    this.toggleNav();
  }

  toggleNav() {
    this.categoryClicked = false;
    this.categoriesActive = false;
    this.headerMobileService.toggleNavActive();
  }

  navigateToAll() {
    this.toggleNav();
    this.router.navigate(['/products'], {
      queryParams: {
        q: null,
        subcategories: null,
        redirectUrl: null,
        order: this.route.snapshot.queryParamMap["params"].order,
        sortBy: this.route.snapshot.queryParamMap["params"].sortBy
      },
      queryParamsHandling: "merge"
    });
  }

  navigateToCategory(category) {
    this.toggleNav();

    this.router.navigate(['/products/category/' + category], {
      queryParams: {
        q: null,
        subcategories: null,
        redirectUrl: null,
        order: this.route.snapshot.queryParamMap["params"].order,
        sortBy: this.route.snapshot.queryParamMap["params"].sortBy
      },
      queryParamsHandling: "merge"
    });
  }

  navigateToSubcategory(category, subcategory) {
    this.toggleNav();

    if (this.route.snapshot.queryParamMap["params"].subcategories !== subcategory) { // only navigate if youre from the other page
      this.filterByService.resetAll();

      this.filterByService.addToActiveFilters(subcategory);

      this.router.navigate(['products/category/' + category], {
        queryParams: {
          q: null,
          subcategories: subcategory,
          redirectUrl: null,
          order: this.route.snapshot.queryParamMap["params"].order,
          sortBy: this.route.snapshot.queryParamMap["params"].sortBy
        },
        queryParamsHandling: "merge"
      });
    }
  }

  toggleCategories() {
    this.categoriesActive = !this.categoriesActive;
  }

  onSelectCategory(index: number) {
    this.categoryClicked = true;
    this.activeCategoryChanged.next(this.categories[+index]);
  }

  closeSubCategories() {
    this.categoryClicked = false;
  }

  onToggleCart() {
    this.cartUiService.toggleCart();
  }
}
