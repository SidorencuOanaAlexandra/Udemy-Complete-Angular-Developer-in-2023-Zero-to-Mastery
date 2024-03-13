import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class EmailTaken implements AsyncValidator {
    constructor(private auth: AngularFireAuth, private lala: AuthService) { }

    validate = async (control: AbstractControl): Promise<ValidationErrors | null> => {
        const response = await this.auth.fetchSignInMethodsForEmail(control.value);
        return response.length > 0 ? { emailTaken: true } : null;
    }
}

