import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterByService {
  activeFilters = [];
  activeSubcategories = [];
  filterByUpdated = new Subject();

  getActiveFilters() {
    return this.activeFilters;
  }

  getActiveSubcategories() {
    return this.activeSubcategories;
  }

  addToActiveFilters(keyword) {
    if (this.activeFilters.includes(keyword)) {
      this.activeFilters.splice(this.activeFilters.indexOf(keyword), 1);
    } else {
      this.activeFilters.push(keyword);
    }
  }

  addToActiveSubcategories(subcategory) {
    if (this.activeSubcategories.includes(subcategory)) {
      this.activeSubcategories.splice(this.activeSubcategories.indexOf(subcategory), 1);
    } else {
      this.activeSubcategories.push(subcategory);
    }
  }

  isFilterActive(keyword: string) {
    return this.activeFilters.includes(keyword) ? true : false;
  }

  isSubcategoryActive(subcategory: string) {
    return this.activeSubcategories.includes(subcategory) ? true : false;
  }

  resetAll() {
    this.activeFilters = [];
    this.activeSubcategories = [];
  }
}
