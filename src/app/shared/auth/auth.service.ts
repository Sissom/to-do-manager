import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';

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

  constructor() {}
}
