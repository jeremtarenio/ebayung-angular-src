import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  errorMsg;
  success;
  error;
  loading;
  passwordForm;
  oldPasswordVisibile = false;
  newPasswordVisible = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.passwordForm = new FormGroup({
      oldPassword: new FormControl(null, [Validators.required]),
      newPassword: new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {
    window.scrollTo({ top: 0 });
    const data = { userId: this.authService.getUserId().toString(), oldPassword: this.passwordForm.get('oldPassword').value, newPassword: this.passwordForm.get('newPassword').value }

    this.loading = true;
    this.authService.updatePassword(data).subscribe(res => {
      this.loading = false;
      this.success = true;
      this.error = false;
    }, err => {
      this.loading = false;
      this.error = true;
      this.success = false;
      this.errorMsg = err.error.message;
      if (this.errorMsg === 'Incorrect password.') { this.passwordForm.reset(); }
    });
  }

  toggleOldPasswordVisibility() {
    this.oldPasswordVisibile = !this.oldPasswordVisibile;
  }

  toggleNewPasswordVisibility() {
    this.newPasswordVisible = !this.newPasswordVisible;
  }
}
