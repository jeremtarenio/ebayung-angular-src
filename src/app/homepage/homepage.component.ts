import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  featureOneImg = 'assets/svg/undraw_deliveries_131a.svg';
  featureOneTitle = 'Lorem, ipsum dolor.';
  featureOneText = 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquid saepe distinctio quod harum accusantium! Voluptas ipsum rem amet, magnam quo natus eveniet cupiditate quidem modi!';

  featureThreeImg = 'assets/svg/undraw_apps_m7mh.svg';
  featureThreeTitle = 'Lorem ipsum dolor sit.';
  featureThreeText = 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dicta voluptatem officiis non consequatur id doloribus quod animi. Doloribus, adipisci!';

  constructor() { }

  ngOnInit() {
  }

}
