import { Component, OnInit, OnDestroy } from '@angular/core';
import { FilterByMobileService } from './filter-by-mobile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter-by-mobile',
  templateUrl: './filter-by-mobile.component.html',
  styleUrls: ['./filter-by-mobile.component.css']
})
export class FilterByMobileComponent implements OnInit, OnDestroy {
  isFilterByMobileActive = false;
  filterByMobileSubscription: Subscription;

  constructor(private filterByMobileService: FilterByMobileService) { }

  ngOnInit() {
    this.filterByMobileSubscription = this.filterByMobileService.filterByMobileToggled.subscribe(f => {
      this.isFilterByMobileActive = f;
    });
  }

  ngOnDestroy(): void {
    this.filterByMobileSubscription.unsubscribe();
  }

  toggle() {
    this.filterByMobileService.toggleFilterByMobile();
  }

}
