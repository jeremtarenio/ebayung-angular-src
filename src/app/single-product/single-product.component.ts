import {
  Component,
  OnInit,
  OnDestroy
} from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductsService } from "../product-list/products.service";
import { SingleProduct } from '../shared/single-product.model';
import { Review } from '../shared/review.model';
import { PagerService } from '../shared/pager.service';
import { CartService } from '../cart/cart.service';
import { AuthService } from '../account/auth.service';

@Component({
  selector: "app-single-product",
  templateUrl: "./single-product.component.html",
  styleUrls: ["./single-product.component.css"]
})
export class SingleProductComponent implements OnInit, OnDestroy {
  activeImg;
  amount = 1;

  productReceivedSubscription: Subscription;
  productPhotosReceivedSubscription: Subscription;
  productReviewsReceivedSubscription: Subscription;

  product: SingleProduct = new SingleProduct(0, ' ', 0, ' ', ' ', ' ', 0, 0, '', '');
  imgUrls = [];

  reviews: Review[] = [];
  pager: any = {};
  pagedReviews: any[]; // paged items

  activeOrder;
  activeSort;

  reviewsLoading = true;
  isLoading = true;
  isAddToCartLoading = false;
  cartServiceSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private pagerService: PagerService,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit() {

    if (this.route.snapshot.queryParamMap['params'].order) {
      this.activeOrder = this.route.snapshot.queryParamMap['params'].order;
    }

    if (this.route.snapshot.queryParamMap['params'].sortBy) {
      this.activeSort = this.route.snapshot.queryParamMap['params'].sortBy;
    }

    this.cartServiceSubscription = this.cartService.cartUpdated.subscribe(response => {
      this.isAddToCartLoading = false;
    });

    this.route.queryParams.subscribe(queryParams => {
      this.activeOrder = queryParams.order;
      this.activeSort = queryParams.sortBy;

      const id = this.route.snapshot.paramMap['params'].id;
      this.productService.getProductReviewsById(id, queryParams);
    });

    this.route.params.subscribe(params => {
      this.productService.getProductById(params.id);
      this.productService.getProductPhotosById(params.id);
      this.productService.getProductReviewsById(params.id, { sortBy: this.activeSort, order: this.activeOrder  });
      this.reviewsLoading = false;
    });

    this.productReceivedSubscription = this.productService.productReceived.subscribe(product => {
      this.product = product;
      if (!this.product.averageRating) { this.product.averageRating = 0; }
      this.isLoading = false;
    });

    this.productPhotosReceivedSubscription = this.productService.productPhotosReceived.subscribe(imgUrls => {
      this.imgUrls = imgUrls;
      this.activeImg = this.imgUrls[0].imgUrl;
    });

    this.productReviewsReceivedSubscription = this.productService.productReviewsReceived.subscribe(reviews => {
      this.reviews = reviews ? reviews : [];
      this.setPage(1);
      this.reviewsLoading = false;
    });
  }

  ngOnDestroy(): void {
    this.productReceivedSubscription.unsubscribe();
    this.productPhotosReceivedSubscription.unsubscribe();
    this.productReviewsReceivedSubscription.unsubscribe();
    this.cartServiceSubscription.unsubscribe();
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.reviews.length, page, 5);
    this.pagedReviews = this.reviews.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }

  onSortBy(sortBy) {
    this.reviewsLoading = true;

    let queryParams = {};
    let querySortBy = "";
    let queryOrder = "DESC";

    if (sortBy.value === "date") {
      querySortBy = "date_time";
    } else if (sortBy.value === "helpfulPoints") {
      querySortBy = "helpfulPoints";
    } else if (sortBy.value === "highestRated") {
      querySortBy = "rating";
    } else if (sortBy.value === "lowestRated") {
      querySortBy = "rating";
      queryOrder = "ASC";
    }

    queryParams = { sortBy: querySortBy, order: queryOrder };

    this.router.navigate([], {
      queryParams: queryParams
    });
  }

  onSelectImg(src) {
    this.activeImg = src;
  }

  getPercentage(score: number) {
    return ((this.countGatheredStars(score) / this.product.noOfRatings) * 100);
  }

  countGatheredStars(score: number) {
    let count = 0;

    for (const review of this.reviews) {
      if (review.rating === score) {
        count++;
      }
    }

    return count;
  }

  isActive(src) {
    return this.activeImg === src ? true : false;
  }

  onChange(val) {
    if (this.amount < 0) {
      alert('Minimum amount allowed is 1.');
      this.amount = 1;
    }
  }

  onAddToCart(productId: number, productName: string) {
    if (this.authService.getUserId()) {
      this.isAddToCartLoading = true;
      this.cartService.addToCart("+", this.authService.getUserId(), productId, this.amount, productName);
    } else {
      this.router.navigate(["/account/login"], {
        queryParams: {
          redirectUrl: this.router.url
        }
      });
    }
  }

  onIncrementAmount() {
    this.amount++;
  }

  onDecrementAmount() {
    if (this.amount > 1) {
      this.amount--;
    }
  }
}
