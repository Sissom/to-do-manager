import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';

const SIGN_IN_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
const SIGN_UP_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="



export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export interface UserData {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = new BehaviorSubject<User | null>(null);
  userToken = null;
  private tokenExpTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  automaticSignIn() {
    const userData: UserData = JSON.parse(localStorage.getItem('userData') as string);
    console.log(userData);
    // Check for locally saved user data
    if (!userData) return;
    const { email, id, _token, _tokenExpirationDate } = userData;
    // If exists, set saved data to variables, add new token expiry
    const loadedUser = new User (
      email,
      id,
      _token,
      new Date(_tokenExpirationDate)
    );
    // Emit user and redirect to current meds view
    if (loadedUser.token) {
      this.currentUser.next(loadedUser);
      this.router.navigate(['current-meds'])
    }
  }

  automaticSignOut(expDuration: number) {
    console.log('Expiration Duration: ', expDuration);
    // Set timeout duration and call logout function when expired
    this.tokenExpTimer = setTimeout(() => {
      this.signOut();
    }, expDuration);
  }

  handleAuth(email: string, userId: string, token: string, expiresIn: number) {
    // Set expiration for token
    const expDate = new Date(new Date().getTime() + expiresIn * 1000);
    //  Take in form info and create a new user based on it
    const formUser = new User(email, userId, token, expDate);
    // Set new expiration timer for token
    this.automaticSignOut(expiresIn * 1000);
    // Emit new user
    this.currentUser.next(formUser);
    // Save user in local storage
    localStorage.setItem('userData', JSON.stringify(formUser));
    this.router.navigate(['current-task']);
  }

  signIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      SIGN_IN_URL + environment.AUTH_API_KEY,
      {
        email,
        password,
        returnSecureToken: true
      }).pipe(
        tap((response) => {
          // Destructure to access all response values
          const { email, localId, idToken, expiresIn } = response;
          // Pass response values to handleAuth method
          this.handleAuth(email, localId, idToken, +expiresIn)}));
  }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(SIGN_UP_URL + environment.AUTH_API_KEY, {
      email,
      password,
      returnSecureToken: true
    })
  }

  signOut() {
    // Emit user as null
    this.currentUser.next(null);
    // Clear user from local storage
    localStorage.removeItem('userData');
    if (this.tokenExpTimer) {
      // Clear any remaining time on token expiration timer
      clearTimeout(this.tokenExpTimer);
    }
    // Navigate back to auth form
    this.router.navigate(['auth']);
  }
}
