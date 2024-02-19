import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseError } from '@firebase/util';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  }
  showAlert = false
  alertMsg = 'Please wait! Your account is being created!'
  alertColor = 'blue'
  inSubmission = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  async login() {
    this.alertMsg = 'Please wait! We are logging you in!'
    this.alertColor = 'blue'

    try {
      this.inSubmission = true
      this.showAlert = true

      await this.authService.logInUser(this.credentials.email, this.credentials.password);
    }
    catch (e: unknown) {
      this.alertMsg = 'An unexpected error occured. Please try again later!';

      if (e instanceof FirebaseError && e.code == 'auth/invalid-login-credentials') {
        this.alertMsg = 'This account does not exist!';
      }

      this.alertColor = 'red'
      this.showAlert = true
      return
    }
    finally {
      this.inSubmission = false
    }

    this.alertMsg = 'Succes! You now are log in.'
    this.alertColor = 'green'
  }

}
