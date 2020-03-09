import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router, ActivatedRoute } from "@angular/router";
import { CartService } from "src/app/cart/cart.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordVisibility = "password";
  isLoginLoading = false;
  serverErrorResponse = null;
  registrationSuccess = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required])
    });

    this.route.queryParams.subscribe(queryParams => {
      if (queryParams["redirected"] || queryParams["redirectUrl"]) {
        this.serverErrorResponse =
          "You need to be logged in to perform that action.";
      }
    });
  }

  onSubmit() {
    this.scrollToTop();
    this.serverErrorResponse = null;
    this.isLoginLoading = true;

    const loginBody = {
      email: this.loginForm.get("email").value,
      password: this.loginForm.get("password").value
    };

    this.authService.login(loginBody).subscribe(
      response => {
        this.isLoginLoading = false;

        this.authService.setUserId(response.userId);
        this.authService.setToken(response.token);
        this.registrationSuccess = true;

        this.authService.setAuthTimer(response.expiry);

        const now = new Date();
        const expiration = new Date(now.getTime() + response.expiry);
        this.authService.saveAuthData(
          response.token,
          expiration,
          response.userId.toString()
        );

        setTimeout(() => {
          this.router
            .navigate([
              this.route.snapshot.queryParamMap["params"].redirectUrl
                ? "/" + this.route.snapshot.queryParamMap["params"].redirectUrl
                : "/"
            ])
            .then(() => {
              this.scrollToTop();
            });
        }, 1000);
      },
      error => {
        this.isLoginLoading = false;
        this.serverErrorResponse = error.error.message;
        this.loginForm.reset();
      }
    );
  }

  scrollToTop() {
    window.scrollTo({ top: 0 });
  }

  togglePasswordVisibility() {
    this.passwordVisibility =
      this.passwordVisibility === "password" ? "text" : "password";
  }

  trim(word: string) {
    if (word) {
      return word.trim();
    }

    return null;
  }

  onClickRegister() {
    this.scrollToTop();
    this.router.navigate(['account/register']);
  }
}
