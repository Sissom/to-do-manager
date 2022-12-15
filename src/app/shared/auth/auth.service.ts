import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';



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
    if (!userData) return;
    const { email, id, _token, _tokenExpirationDate } = userData;
    const loadedUser = new User (
      email,
      id,
      _token,
      new Date(_tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.currentUser.next(loadedUser);
      console.log("user: ", loadedUser)
      this.router.navigate(['current-tasks']);
    }
  };

  automaticSignOut(expDuration: number) {
    console.log('Expiration Duration: ', expDuration);
    this.tokenExpTimer = setTimeout(() => {
      this.signOut();
    }, expDuration);
  };

  handleAuth(email: string, userId: string, token: string, expiresIn: number) {
    const expDate = new Date(new Date().getTime() + expiresIn * 1000);
    const formUser = new User(email, userId, token, expDate);
    this.automaticSignOut(expiresIn * 1000);
    this.currentUser.next(formUser);
    localStorage.setItem("userData", JSON.stringify(formUser));
  };

  signIn(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      environment.SIGN_IN_URL + environment.firebaseAPIKey,
      {
        email,
        password,
        returnSecureToken: true
      }).pipe(
        tap((response) => {
          const { email, localId, idToken, expiresIn } = response;
          this.handleAuth(email, localId, idToken, +expiresIn);
        })
      );
  };

  signOut() {
    this.currentUser.next(null);
    localStorage.removeItem('userData');
    if (this.tokenExpTimer) {
      clearTimeout(this.tokenExpTimer);
    }
    this.router.navigate(['auth']);
  };

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(environment.SIGN_UP_URL + environment.firebaseAPIKey, {
      email,
      password,
      returnSecureToken: true
    })
    .pipe(
      tap((response) => {
        const { email, localId, idToken, expiresIn } = response;
        this.handleAuth(email, localId, idToken, +expiresIn)
      })
    );
  };
}
