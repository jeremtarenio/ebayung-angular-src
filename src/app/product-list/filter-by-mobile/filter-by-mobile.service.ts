import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterByMobileService {
  isFilterByMobileActive = false;
  filterByMobileToggled = new Subject<boolean>();
  htmlTag = document.documentElement;

  constructor() { }

  toggleFilterByMobile() {
    this.isFilterByMobileActive = !this.isFilterByMobileActive;
    this.filterByMobileToggled.next(this.isFilterByMobileActive);

    if (this.isFilterByMobileActive) {
      this.htmlTag.classList.add("scrolling-disabled");
    } else {
      this.htmlTag.classList.remove("scrolling-disabled");
    }
  }

  disableFilterByMobile() {
    this.isFilterByMobileActive = false;
    this.filterByMobileToggled.next(false);
    this.htmlTag.classList.remove("scrolling-disabled");
  }

}
