import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";
import {
  HttpHandler,HttpInterceptor, HttpParams, HttpRequest
} from "@angular/common/http";
import { exhaustMap, take } from "rxjs/operators";

@Injectable ()
export class AuthInterceptorService implements HttpInterceptor {
  constructor (private authService: AuthService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.includes('https://identitytoolkit.googleapis.com') || req.url.includes('https://to-do-manager-2ffb3-default-rtdb.firebaseio.com/tasks/')) {
    return this.authService.currentUser.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) return next.handle(req);

        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', (user.token as string))
        });
        return next.handle(modifiedReq);
      })
    );} else {
      return next.handle(req);
    }
  }
}
