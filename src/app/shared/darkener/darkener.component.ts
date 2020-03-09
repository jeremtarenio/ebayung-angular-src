import { Component, OnInit } from '@angular/core';
import { FilterByMobileService } from 'src/app/product-list/filter-by-mobile/filter-by-mobile.service';
import { HeaderMobileService } from 'src/app/header-mobile/header-mobile.service';

@Component({
  selector: 'app-darkener',
  templateUrl: './darkener.component.html',
  styleUrls: ['./darkener.component.css']
})
export class DarkenerComponent implements OnInit {

  constructor(private filterByMobileService: FilterByMobileService,
              private headerMobileService: HeaderMobileService) { }

  ngOnInit() {
  }

  onClickDarkener() {
    this.filterByMobileService.disableFilterByMobile();
    this.headerMobileService.disableNav();
  }
}
