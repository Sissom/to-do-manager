import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HTTPService } from '../http/http.service';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  hide = true;
  reactiveAuthForm!: FormGroup;
  isLoginMode = true;
  authObsrv: Observable<AuthResponseData> | undefined;
  errMsg = null;

  constructor(private _formBuilder: FormBuilder, private authService: AuthService, private router: Router, private http: HTTPService) {}

  ngOnInit(): void {
    this.authService.automaticSignIn();
    this.reactiveAuthForm = this._formBuilder.group({
      password: new FormControl ('', [Validators.required])
    })
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
  }

  onSubmit() {
    if (!this.reactiveAuthForm.valid) return;

    const { email, password } = this.reactiveAuthForm.value;

    if (this.isLoginMode) {
      this.authObsrv = this.authService.signIn(email, password);
    } else {
      this.authObsrv = this.authService.signUp(email, password);
    }

    this.authObsrv.subscribe(
      (res) => {
        console.log("Response Successful:", res);
        if (this.errMsg) this.errMsg = null;
        this.router.navigate(['current-tasks'])
      },
      (err) => {
        console.error("Response Error:", err);
        this.errMsg = err.message;
      }
    );
  }

  getErrorMessage() {
    if (this.reactiveAuthForm.hasError('required')) {
      return 'Please enter a valid email address.';
    }

    return this.reactiveAuthForm.hasError('email') ? 'Not a valid email' : '';
    }
}
