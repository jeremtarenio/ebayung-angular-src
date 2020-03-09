import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/product-list/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-product-list',
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.css']
})
export class AdminProductListComponent implements OnInit {
  products;

  constructor(private productsService: ProductsService, private router: Router) { }

  ngOnInit() {
    this.productsService.adminGetProducts().subscribe(res => {
      this.products = res.products;

    });
  }

  onEdit(id) {
    this.router.navigate(['admin/products/edit'], {
      queryParams: {
        productId: id
      }
    });
    /* window.scroll(0,0); */
  }

}
