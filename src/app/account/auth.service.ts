import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token;
  private userLoggedIn = new Subject<boolean>();
  private isUserLoggedIn = false;
  private userId;
  userFirstName;
  userLastName;
  private tokenTimer;

  constructor(private httpClient: HttpClient) {}

  setToken(token) {
    this.token = token;
    this.isUserLoggedIn = true;
    this.userLoggedIn.next(true);
  }

  getToken() {
    return this.token;
  }

  setUserId(id) {
    this.userId = id;
  }

  getUserId() {
    return this.userId;
  }

  getAuthListener() {
    return this.userLoggedIn.asObservable();
  }

  getAuthStatus() {
    return this.isUserLoggedIn;
  }

  getUserInfo() {
    return this.httpClient.get<{
      success: string;
      result: {
        userId: number;
        firstName: string;
        lastName: string;
        email: string;
        contactNumber: string;
        deliveryAddress: string;
        role: string
      }[];
    }>(environment.apiUrl + "/api/users/" + this.userId + "/info");
  }

  createUser(user: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    contact_number: string;
    delivery_address: string;
  }) {
    return this.httpClient.post(environment.apiUrl + "/api/users/", user);
  }

  updateUser(user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    deliveryAddress: string;
  }) {
    return this.httpClient.patch(environment.apiUrl + "/api/users/", user);
  }

  updatePassword(data: {userId: string; oldPassword: string; newPassword: string}) {
    return this.httpClient.patch(environment.apiUrl + "/api/users/update-password", data);
  }

  login(credentials: { email: string; password: string }) {
    return this.httpClient.post<{
      success: number;
      message: string;
      userId: number;
      token: string;
      expiry: number;
    }>(environment.apiUrl + "/api/users/login", credentials);
  }

  logout() {
    this.token = null;
    this.isUserLoggedIn = false;
    this.userId = null;
    this.userLoggedIn.next(false);
    this.clearAuthData();
  }

  checkIfEmailExists(email: string) {
    return this.httpClient.post(environment.apiUrl + "/api/users/check-email", {
      email: email
    });
  }

  saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");

    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    let expiresIn;

    if (authInformation) {
      const now = new Date();
      expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    }

    if (expiresIn > 0) {
      // if expiresIn is negative, token is expired
      this.token = authInformation.token;
      this.isUserLoggedIn = true;
      this.setAuthTimer(expiresIn);
      this.userLoggedIn.next(true);
      this.userId = authInformation.userId;
    }
  }

  setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration); // expiry is in ms
  }
}
