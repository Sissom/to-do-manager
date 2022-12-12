import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  hide = true;
  reactiveAuthForm!: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {

    this.reactiveAuthForm = this._formBuilder.group({
      email: new FormControl ('', [Validators.required, Validators.email]),
      password: new FormControl ('', [Validators.required])
    })
  }

getErrorMessage() {
  if (this.reactiveAuthForm.hasError('required')) {
    return 'Please enter a valid email address.';
  }

  return this.reactiveAuthForm.hasError('email') ? 'Not a valid email' : '';
  }
}
