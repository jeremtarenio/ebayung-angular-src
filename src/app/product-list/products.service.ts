import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ProductListItem } from "../shared/product-list-item.model";
import { SingleProduct } from "../shared/single-product.model";
import { Review } from "../shared/review.model";
import { environment } from "src/environments/environment";
import { AdminProductModel } from '../admin/admin-product.model';

@Injectable({
  providedIn: "root"
})
export class ProductsService {
  private products: ProductListItem[] = [];
  productsUpdated = new Subject<ProductListItem[]>();
  productReceived = new Subject<SingleProduct>();
  productPhotosReceived = new Subject<[]>();
  productReviewsReceived = new Subject<Review[]>();

  constructor(private httpClient: HttpClient) {}

  createProduct(product: AdminProductModel) {
    return this.httpClient.post(environment.apiUrl + "/api/products", product);
  }

  adminGetProducts() {
    return this.httpClient.get<{ success: number, products: [] }>(environment.apiUrl + "/api/products/admin/get");
  }

  getKeywords() {
    return this.httpClient.get<{ success: number, keywords: [] }>(environment.apiUrl + "/api/products/keywords/get");
  }

  getProducts(queryParams) {
    const filters = queryParams.filters ? queryParams.filters : "";
    const sortBy = queryParams.sortBy ? queryParams.sortBy : "";
    const order = queryParams.order ? queryParams.order : "";
    const q = queryParams.q ? queryParams.q : "";

    this.httpClient
      .get<{ success: string; products: ProductListItem[] }>(
        environment.apiUrl +
          "/api/products?filters=" +
          filters +
          "&q=" + q +
          "&sortBy=" +
          sortBy +
          "&order=" +
          order
      )
      .subscribe(productsData => {
        this.products = productsData.products;
        this.productsUpdated.next([...this.products]);
      });
  }

  getProductsByCategory(params, queryParams) {
    const category = params.category ? params.category : "";
    const subcategories = queryParams.subcategories ? queryParams.subcategories : "";
    const filters = queryParams.filters ? queryParams.filters : "";
    const sortBy = queryParams.sortBy ? queryParams.sortBy : "";
    const order = queryParams.order ? queryParams.order : "";

    this.httpClient
      .get<{ success: string; products: ProductListItem[] }>(
        environment.apiUrl +
          "/api/products/category/" +
          category +
          "?filters=" +
          filters +
          "&subcategories=" +
          subcategories +
          "&sortBy=" +
          sortBy +
          "&order=" +
          order
      )
      .subscribe(productsData => {
        this.products = productsData.products;
        this.productsUpdated.next([...this.products]);
      }, error => {
        /* console.log(error); */
      });
  }

  getProductById(id: number) {
    this.httpClient
      .get<{ success: string; product: SingleProduct }>(
        environment.apiUrl + "/api/products/" + id
      )
      .subscribe(productsData => {
        this.productReceived.next(productsData.product);
      });
  }

  getProductPhotosById(id: number) {
    this.httpClient
      .get<{ success: string; imgUrls: [] }>(
        environment.apiUrl + "/api/products/" + id + "/photos"
      )
      .subscribe(productsData => {
        this.productPhotosReceived.next(productsData.imgUrls);
      });
  }

  getProductReviewsById(id: number, queryParams) {
    let sortBy = queryParams.sortBy;
    let order = queryParams.order;

    if (!queryParams.sortBy) {
      sortBy = "";
    }

    if (!queryParams.order) {
      order = "";
    }

    this.httpClient
      .get<{ success: string; reviews: Review[] }>(
        environment.apiUrl +
          "/api/products/" +
          id +
          "/reviews?sortBy=" +
          sortBy +
          "&order=" +
          order
      )
      .subscribe(productsData => {
        this.productReviewsReceived.next(productsData.reviews);
      });
  }

  getSubCategories(category: string) {
    return this.httpClient.get<{
      success: string;
      result: { subCategory: string; count: number }[];
    }>(environment.apiUrl + "/api/products/" + category + "/sub-categories");
  }
}
