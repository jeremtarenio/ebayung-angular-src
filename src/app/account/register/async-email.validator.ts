import { FormControl } from "@angular/forms";
import { map, switchMap } from "rxjs/operators";
import { AuthService } from "../auth.service";
import { timer } from "rxjs";

export class ValidateEmailNotTaken {

  static createValidator(authService: AuthService) {
    return (control: FormControl) => {
      return timer(500).pipe(
        switchMap(() => {
          return authService.checkIfEmailExists(control.value).pipe(
            map(res => {
              return res["forbiddenEmails"].length === 0
                ? null
                : { emailExists: true };
            })
          );
        })
      );
    };
  }

  /* static createValidator(authService: AuthService) {
    return (control: FormControl) => {
      return authService.checkIfEmailExists(control.value).pipe(map(res => {
        return res['forbiddenEmails'].length === 0 ? null : { emailExists: true };
      }));
    };
  } */
}
