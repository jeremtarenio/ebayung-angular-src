import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthService } from "../../auth.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ValidateEmailNotTaken } from "../../register/async-email.validator";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  userInfo;
  loading = true;
  profileForm;
  success = false;
  error: boolean;
  errorMsg: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.profileForm = new FormGroup({
      firstName: new FormControl({ value: null, disabled: true }, [
        Validators.required
      ]),
      lastName: new FormControl({ value: null, disabled: true }, [
        Validators.required
      ]),
      email: new FormControl(
        { value: null, disabled: true },
        [Validators.required, Validators.email]
      ),
      contactNumber: new FormControl({ value: null, disabled: true }, [
        Validators.required
      ]),
      deliveryAddress: new FormControl({ value: null, disabled: true }, [
        Validators.required
      ])
    });

    this.loadUserInfo();
  }

  loadUserInfo() {
    this.authService.getUserInfo().subscribe(res => {
      const userInfo = res.result[0];
      this.loading = false;
      if (userInfo) {
        this.profileForm.get("firstName").setValue(userInfo.firstName);
        this.profileForm.get("lastName").setValue(userInfo.lastName);
        this.profileForm.get("email").setValue(userInfo.email);
        this.profileForm.get("contactNumber").setValue(userInfo.contactNumber);
        this.profileForm
          .get("deliveryAddress")
          .setValue(userInfo.deliveryAddress);
      }
    });
  }

  onEdit(formControlName: string) {
    this.profileForm.get(formControlName).disabled
      ? this.profileForm.get(formControlName).enable()
      : this.profileForm.get(formControlName).disable();
  }

  onSubmit() {
    window.scrollTo({ top: 0 });
    this.loading = true;
    const user = {
      userId: this.authService.getUserId().toString().trim(),
      firstName: this.profileForm.get("firstName").value.trim(),
      lastName: this.profileForm.get("lastName").value.trim(),
      email: this.profileForm.get("email").value.trim(),
      contactNumber: this.profileForm.get("contactNumber").value.trim(),
      deliveryAddress: this.profileForm.get("deliveryAddress").value.trim()
    };
    this.authService.updateUser(user).subscribe(res => {
      this.loading = false;
      this.success = true;
      this.error = false;
      this.loadUserInfo();
      this.profileForm.disable();
    }, err => {
      this.loading = false;
      this.error = true;
      this.success = false;
      this.loadUserInfo();
      this.errorMsg = err.error.message;
    });
  }
}
