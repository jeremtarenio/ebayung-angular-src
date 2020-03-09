import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userCompleteName;
  loading = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUserInfo().subscribe(res => {
      this.userCompleteName = res.result[0].firstName + ' ' + res.result[0].lastName;
      this.loading = false;
    });
  }

}
