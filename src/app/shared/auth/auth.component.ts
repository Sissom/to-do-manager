import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HTTPService } from '../http/http.service';
import { AuthResponseData } from './auth.service';

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
  formSubmitted = false;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {

    this.reactiveAuthForm = this._formBuilder.group({
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl ('', [Validators.required])
    })
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode
    // console.log("Mode Switched")
  }

  onSubmit() {
    if (!this.reactiveAuthForm.valid) return;
    this.formSubmitted = true;
    // console.log(this.reactiveAuthForm.value)

    setTimeout(() => {
      this.reactiveAuthForm.reset();
      this.formSubmitted = false;
    }, 5000);
  }

  getErrorMessage() {
    if (this.reactiveAuthForm.hasError('required')) {
      return 'Please enter a valid email address.';
    }

    return this.reactiveAuthForm.hasError('email') ? 'Not a valid email' : '';
    }
}
