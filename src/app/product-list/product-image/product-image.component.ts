import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-image',
  templateUrl: './product-image.component.html',
  styleUrls: ['./product-image.component.css']
})
export class ProductImageComponent implements OnInit {
  @Input() imgSrc: string;
  isLoading = true;

  constructor() {
  }

  ngOnInit() {
  }

  onLoad() {
    this.isLoading = false;
  }

}
