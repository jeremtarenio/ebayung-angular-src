import { Injectable, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HeaderMobileService {
  isNavActive = false;
  navToggled = new Subject<boolean>();
  htmlTag = document.documentElement;

  constructor() { }

  toggleNavActive() {
    this.isNavActive = !this.isNavActive;
    this.navToggled.next(this.isNavActive);

    if (this.isNavActive) {
      this.htmlTag.classList.add("scrolling-disabled");
    } else {
      this.htmlTag.classList.remove("scrolling-disabled");
    }

  }

  disableNav() {
    this.isNavActive = false;
    this.navToggled.next(false);
    this.htmlTag.classList.remove("scrolling-disabled");
  }
}
