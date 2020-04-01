import { Component, OnInit } from "@angular/core";
import { Category } from "../shared/category.model";
import { CategoriesService } from "../shared/categories.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CartUiService } from '../cart/cart-ui.service';

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"]
})
export class FooterComponent implements OnInit {
  categories: Category[];

  constructor(
    private categoryService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute,
    private cartUiService: CartUiService
  ) {}

  ngOnInit() {
    this.categoryService.categoriesFetched.subscribe(res => {
      this.categories = res;
    });
  }

  onNavigate(address: string) {
    window.scrollTo({ top: 0 });
    this.router.navigate([address]);
  }

  onToggleCart() {
    this.cartUiService.toggleCart();
  }

  navigateToCategory(category) {
    window.scrollTo({ top: 0 });
    this.router.navigate(["/products/category/" + category], {
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
}
