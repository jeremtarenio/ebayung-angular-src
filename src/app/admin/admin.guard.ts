import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from '../account/auth.service';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (this.authService.getAuthStatus()) {
      this.authService.getUserInfo().subscribe(res => {
        if (res.result[0].role !== 'admin') {
          this.router.navigate(["404"]);
        }
      });
    }

    return true;
  }
}
