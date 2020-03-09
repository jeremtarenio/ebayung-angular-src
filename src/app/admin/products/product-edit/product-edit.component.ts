import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { ProductsService } from "src/app/product-list/products.service";
import { HttpClient } from "@angular/common/http";
import { SingleProduct } from "src/app/shared/single-product.model";
import { environment } from "src/environments/environment";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-product-edit",
  templateUrl: "./product-edit.component.html",
  styleUrls: ["./product-edit.component.css"]
})
export class ProductEditComponent implements OnInit, AfterViewInit {
  newProductForm: FormGroup;
  keywords;
  loading = true;

  productId;
  editMode;

  @ViewChild('top', { static: false }) divToScroll: ElementRef;
  error: boolean;
  success: boolean;
  errorMsg: any;
  successMsg: string;

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.newProductForm = new FormGroup({
      productName: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      desc1: new FormControl(null, [Validators.required]),
      desc2: new FormControl(null, [Validators.required]),
      desc3: new FormControl(null, [Validators.required]),
      category: new FormControl(null, [Validators.required]),
      subcategory: new FormControl(null, [Validators.required]),
      imgUrls: new FormArray([]),
      keywords: new FormArray([])
    });

    this.productsService.getKeywords().subscribe(res => {
      this.keywords = res.keywords;
      this.loading = false;
    });

    this.route.queryParamMap.subscribe(res => {
      this.editMode = res["params"].productId ? true : false;
      this.productId = res["params"].productId;

      if (!this.editMode) {
        this.editMode = false;
        this.newProductForm.reset();
        this.clearFormArray(this.newProductForm.get('imgUrls') as FormArray);
        this.clearFormArray(this.newProductForm.get('keywords') as FormArray);

        const control = new FormControl(null, Validators.required);
        (this.newProductForm.get("imgUrls") as FormArray).push(control);

        const control2 = new FormControl(null, Validators.required);
        (this.newProductForm.get("keywords") as FormArray).push(control2);
      } else {
        this.fillProductDetails();
        this.fillImgUrls();
        this.fillKeyWords();

      }
    });
  }

  ngAfterViewInit(): void {
    this.scrollToTop();
  }

  fillProductDetails() {
    return this.httpClient
      .get<{ success: string; product: SingleProduct }>(
        environment.apiUrl + "/api/products/" + this.productId
      )
      .subscribe(res => {
        this.newProductForm.get("productName").setValue(res.product.name);
        this.newProductForm.get("price").setValue(res.product.price);
        this.newProductForm.get("desc1").setValue(res.product.productDesc1);
        this.newProductForm.get("desc2").setValue(res.product.productDesc2);
        this.newProductForm.get("desc3").setValue(res.product.productDesc3);
        this.newProductForm.get("category").setValue(res.product.category);
        this.newProductForm
          .get("subcategory")
          .setValue(res.product.subcategory);
      });
  }

  fillImgUrls() {
    return this.httpClient
      .get<{ success: string; imgUrls: [] }>(environment.apiUrl + "/api/products/" + this.productId + "/photos").subscribe(res => {
        res.imgUrls.forEach(obj => {
          const control = new FormControl(null, Validators.required);
          control.setValue(obj["imgUrl"]);
          (this.newProductForm.get("imgUrls") as FormArray).push(control);
        });
      });
  }

  fillKeyWords() {
    return this.httpClient
      .get<{ success: string; keywords: { productId: string; keywordId: string; keyword: string }[] }>(environment.apiUrl + "/api/products/" + this.productId + "/keywords")
      .subscribe(res => {
        res.keywords.forEach(obj => {
          const control = new FormControl(null, Validators.required);
          control.setValue(obj.keywordId.toString());
          (this.newProductForm.get("keywords") as FormArray).push(control);
        });
      });
  }

  clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0);
    }
  }

  onSubmit() {
    this.scrollToTop();
    this.loading = true;

    const product = {
      productId: this.productId,
      productName: this.newProductForm.get("productName").value,
      price: this.newProductForm.get("price").value,
      desc1: this.newProductForm.get("desc1").value,
      desc2: this.newProductForm.get("desc2").value,
      desc3: this.newProductForm.get("desc3").value,
      category: this.newProductForm.get("category").value ? this.newProductForm.get("category").value.toLowerCase() : null,
      subcategory: this.newProductForm.get("subcategory").value ? this.newProductForm.get("subcategory").value.toLowerCase() : null,
      imgUrls: this.newProductForm.get("imgUrls").value,
      keywords: this.newProductForm.get("keywords").value,
    };

    if (this.editMode) {
      this.httpClient.patch(environment.apiUrl + "/api/products/", product).subscribe(res => {
        this.loading = false;
        this.error = false;
        this.success = true;
        this.successMsg = "Successfully updated.";
      }, err => {
        this.loading = false;
        this.success = false;
        this.error = true;
        this.errorMsg = err.error.message;
      });
    } else {
      if (this.newProductForm.valid) {
        this.productsService.createProduct(product).subscribe(
          res => {
            this.loading = false;
            this.error = false;
            this.success = true;
            this.successMsg = "Successfully created.";
          },
          err => {
            this.loading = false;
            this.success = false;
            this.error = true;
            this.errorMsg = err.error.message;
          }
        );
      } else {
        this.loading = false;
        this.success = false;
        this.error = true;
        this.errorMsg = 'Invalid input.';
      }
    }
  }

  scrollToTop() {
    this.divToScroll.nativeElement.scrollIntoView();
  }

  onAddImageURL() {
    const control = new FormControl(null, Validators.required);
    (this.newProductForm.get("imgUrls") as FormArray).push(control);
  }

  onAddKeyword() {
    const control = new FormControl(null, Validators.required);
    (this.newProductForm.get("keywords") as FormArray).push(control);
  }

  onRemoveKeyword(index) {
    if ((this.newProductForm.get("keywords") as FormArray).length > 1) {
      (this.newProductForm.get("keywords") as FormArray).removeAt(index);
    }
  }

  onRemoveImgUrl(index) {
    if ((this.newProductForm.get("imgUrls") as FormArray).length > 1) {
      (this.newProductForm.get("imgUrls") as FormArray).removeAt(index);
    }
  }

}
