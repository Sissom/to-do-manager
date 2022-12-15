import { Component } from '@angular/core';
import { AuthService } from './shared/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'to-do-manager';

  constructor(private authService: AuthService) {}

  ngOnInit () {
    // this.authService.automaticSignIn();
  }
}
