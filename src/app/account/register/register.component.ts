import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ValidateEmailNotTaken } from './async-email.validator';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registrationForm: FormGroup;
  forbiddenEmails = [];
  serverErrorResponse = "";
  registrationSuccess = false;
  passwordVisibility = "password";
  isRegistrationLoading = false;

  constructor(private router: Router, private authService: AuthService) { }

  static markAllDirty(control: FormGroup) {
    if (control.hasOwnProperty('controls')) {
        control.markAsDirty(); // mark group
        const ctrl = control as any;

        // tslint:disable-next-line: forin
        for (const inner in ctrl.controls) {
            this.markAllDirty(ctrl.controls[inner] as FormGroup);
        }
    } else {
        ((control) as FormGroup).markAsDirty();
    }
}
  ngOnInit() {
    const regex: RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    this.registrationForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required], this.empty),
      lastName: new FormControl(null, [Validators.required], this.empty),
      email: new FormControl(null, [Validators.required, Validators.pattern(regex.source)], ValidateEmailNotTaken.createValidator(this.authService)),
      password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+,.]).{8,}$')]),
      contactNumber: new FormControl(null, [Validators.required], this.empty),
      deliveryAddress: new FormControl(null)
    });
  }

  onSubmit() {
    window.scrollTo({ top: 0 });
    this.isRegistrationLoading = true;
    RegisterComponent.markAllDirty(this.registrationForm);

    const user = {
      first_name: this.trim(this.registrationForm.get('firstName').value),
      last_name: this.trim(this.registrationForm.get('lastName').value),
      email: this.registrationForm.get('email').value,
      password: this.registrationForm.get('password').value,
      contact_number: this.trim(this.registrationForm.get('contactNumber').value),
      delivery_address: this.trim(this.registrationForm.get('deliveryAddress').value)
    };

    this.authService.createUser(user).subscribe(result => {
      this.isRegistrationLoading = false;
      this.serverErrorResponse = "";
      this.registrationSuccess = true;

      setTimeout(() => {
        this.router.navigate(['account/login']);
      }, 1000);
    }, error => {
      this.isRegistrationLoading = false;
      this.serverErrorResponse = error.error.err_code;
    });
  }

  clearError() {
    this.serverErrorResponse = "";
  }

  togglePasswordVisibility() {
    this.passwordVisibility = this.passwordVisibility === 'password' ? 'text' : 'password';
  }


  // prevents white spaces in an input
  empty(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
        const trimmed = control.value.trim();
        console.log(trimmed);

        if (!trimmed) {
          resolve({ 'empty': true });
        } else {
          resolve(null);
        }
    });

    return promise;
  }

  trim(word: string) {
    if (word) {
      return word.trim();
    }

    return null;
  }
}
