import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/category.model';
import { CategoriesService } from '../shared/categories.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  categories: Category[];

  constructor(private categoryService: CategoriesService) { }

  ngOnInit() {
    this.categoryService.categoriesFetched.subscribe(res => {
      this.categories = res;
    });
  }

}
