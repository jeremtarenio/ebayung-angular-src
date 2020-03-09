import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feature-one',
  templateUrl: './feature-one.component.html',
  styleUrls: ['./feature-one.component.css']
})
export class FeatureOneComponent implements OnInit {
  @Input() illus: string;
  @Input() title: string;
  @Input() text: string;

  constructor() { }

  ngOnInit() {
  }

}
