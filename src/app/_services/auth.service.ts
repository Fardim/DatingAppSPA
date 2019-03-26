import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: "root"
})
export class AuthService {
    baseUrl = "https://localhost:44395/api/auth/";
    userToken: any;
    decodedToken: any;
    jwtHelper: JwtHelperService = new JwtHelperService();

    constructor(private http: HttpClient) { }

    login(model: any) {
        return this.http
            .post(this.baseUrl + "login", model, this.getHeader())
            .pipe(map(
                (res: { tokenString: string }) => {
                    const user = res;
                    console.log("res", res);
                    if (user) {
                        localStorage.setItem("token", user.tokenString);
                        this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
                        console.log('decoded', this.decodedToken);
                        this.userToken = user.tokenString;
                        console.log("Successfully logged in");
                    }
                }
            ), catchError(this.handleError));
    }

    register(model) {
        return this.http.post(this.baseUrl + "register", model, this.getHeader()).pipe(map(() => { }), catchError(this.handleError));
    }

    private getHeader() {
        const headers = new HttpHeaders({ "Content-type": "application/json" });
        return { headers: headers };
    }
    loggedIn() {
        return !this.jwtHelper.isTokenExpired(localStorage.getItem('token'));
    }

    logout() {
        // this.userToken = null;
        // localStorage.removeItem("token");
    }

    private handleError(error: any) {
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
            return throwError(applicationError);
        }
        const serverError = error.error;
        let modelStateErrors = '';
        if (serverError) {
            for (const key in serverError) {
                if (serverError[key]) {
                    modelStateErrors += serverError[key] + '\n';
                }
            }
        }
        return throwError(modelStateErrors || 'Server error');
    }
}
