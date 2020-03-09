import { Injectable } from '@angular/core';
import { Category } from './category.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  dummyCats: Category[] = [
    new Category('Recipe-boxes', ['writer', 'emergency', 'stop', 'hesitate', 'wound'], ''),
    new Category('Fridge', ['momentum', 'maximum', 'arch', 'regret', 'perception'], ''),
    new Category('Pantry', ['adopt', 'depend', 'fork', 'needle', 'explosion'], ''),
    new Category('Household', ['share', 'minimize', 'abbey'], ''),
    new Category('Drinks', ['precision', 'grip', 'present', 'hotdog', 'environment'], ''),
    new Category('Promotions', ['directory', 'ankle', 'tendency', 'cup', 'appeal'], '')
  ];
  categories: Category[] = [];
  categoriesFetched = new Subject<Category[]>();
  loadingDone = new Subject();

  constructor(private httpClient: HttpClient) { }

  getCategories() {
    return this.categories;
  }

  fetchCategories() {
    let categories = []

    return this.httpClient.get<{ success: string; result: { category: string }[] }>(environment.apiUrl + "/api/products/categories/get").subscribe(res => {
      res.result.forEach(obj => {
        let subCats = [];

        this.httpClient.get<{ success: string; result: { subCategory: string, count: number }[] }>(environment.apiUrl + "/api/products/" + obj.category + "/sub-categories").subscribe(res => {
              res.result.forEach(obj => {
                subCats.push(obj.subCategory);
              });

            });
        categories.push(new Category(obj.category, subCats, obj.category));
      });
      /* categories.push(...this.dummyCats); */
      this.categories = categories;
      this.categoriesFetched.next(categories);
      this.loadingDone.next();
    });
  }

  getValidCategories() {
    return this.httpClient.get<{ success: string; result: { category: string }[] }>(environment.apiUrl + "/api/products/categories/get");
  }
}
