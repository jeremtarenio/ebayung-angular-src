import { Component, OnInit, OnDestroy, HostListener } from "@angular/core";
import { FilterByService } from "./filter-by.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ProductsService } from '../products.service';

@Component({
  selector: "app-filter-by",
  templateUrl: "./filter-by.component.html",
  styleUrls: ["./filter-by.component.css"]
})
export class FilterByComponent implements OnInit {
  subcategories = [];
  producers = [];
  activeFilters = [];
  activeSubcategories = [];
  queryParamsSubscriptions: Subscription;

  constructor(
    private filterByService: FilterByService,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      // clear actives during route change
      this.initializeCheckboxes();

      this.productService.getSubCategories(params.category).subscribe(res => {
        this.subcategories = res.result;
      });
    });

    this.route.queryParams.subscribe(res => {
      this.initializeCheckboxes();
    });
  }

  initializeCheckboxes() {
    this.filterByService.resetAll();

    if (this.route.snapshot.queryParamMap["params"].filters) {
      this.route.snapshot.queryParamMap["params"].filters
        .split(",")
        .forEach(queryParam => {
          this.filterByService.addToActiveFilters(queryParam);
        });
    }

    if (this.route.snapshot.queryParamMap["params"].subcategories) {
      this.route.snapshot.queryParamMap["params"].subcategories
        .split(",")
        .forEach(queryParam => {
          this.filterByService.addToActiveSubcategories(queryParam);
        });
    }
  }


  onToggleFilter(keyword: string) {
    this.filterByService.addToActiveFilters(keyword);
    this.filterByService.filterByUpdated.next();

    this.router.navigate([], {
      queryParams: {
        filters: this.filterByService.activeFilters.toString()
      },
      queryParamsHandling: "merge"
    });
  }

  onToggleSubcategory(subcategory: string) {
    this.filterByService.addToActiveSubcategories(subcategory);
    this.filterByService.filterByUpdated.next();

    this.router.navigate([], {
      queryParams: {
        subcategories: this.filterByService.activeSubcategories.toString()
      },
      queryParamsHandling: "merge"
    });
  }

  isFilterActive(keyword: string) {
    return this.filterByService.getActiveFilters().includes(keyword) ? true : false;
  }

  isSubcategoryActive(subcategory: string) {
    return this.filterByService.getActiveSubcategories().includes(subcategory) ? true : false;
  }
}
