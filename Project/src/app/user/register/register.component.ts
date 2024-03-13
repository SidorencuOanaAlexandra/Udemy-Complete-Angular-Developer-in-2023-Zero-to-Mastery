import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import IUser from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private authService: AuthService, private emailValidator: EmailTaken) { }

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ], [this.emailValidator.validate])
  age = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(80)
  ])
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  confirmPassword = new FormControl('', [
    Validators.required,
  ])
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)
  ])

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirmPassword: this.confirmPassword,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password', 'confirmPassword')])

  showAlert = false
  alertMsg = 'Please wait! Your account is being created!'
  alertColor = 'blue'
  inSubmission = false;

  async register() {
    this.alertMsg = 'Please wait! Your account is being created!'
    this.alertColor = 'blue'

    try {
      this.showAlert = true
      this.inSubmission = true

      await this.authService.createUser(this.registerForm.value as IUser)
    }
    catch (e) {
      this.alertMsg = 'An unexpected error occured. Please try again later! ' + e
      this.alertColor = 'red'
      return
    }
    finally {
      this.inSubmission = false
    }

    this.alertMsg = 'Succes! your account has been created.'
    this.alertColor = 'green'
  }
}
