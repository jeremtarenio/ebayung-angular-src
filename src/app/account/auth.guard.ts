import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const userLoggedIn = this.authService.getAuthStatus();

    if (!userLoggedIn) {
      this.router.navigate(["/account/login"], {
        queryParams: {
          redirectUrl: '/account/dashboard'
        }
      });
    }

    return userLoggedIn; // do not proceed if user is NOT logged in
  }
}
