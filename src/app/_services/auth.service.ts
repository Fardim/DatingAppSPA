import { User } from './../_models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    baseUrl = 'https://localhost:44395/api/auth/';
    userToken: any;
    decodedToken: any;
    currentUser: User;
    jwtHelper: JwtHelperService = new JwtHelperService();
    private photourl = new BehaviorSubject<string>('../../assets/user.png');
    currentPhotoUrl = this.photourl.asObservable();

    constructor(private http: HttpClient) {}

    changeMemberPhoto(photoUrl: string) {
        this.photourl.next(photoUrl);
    }
    login(model: any) {
        return this.http
            .post(this.baseUrl + 'login', model, this.getHeader())
            .pipe(
                map((res: { tokenString: string; user: User }) => {
                    const userData = res;
                    console.log('res', res);
                    if (userData) {
                        localStorage.setItem('token', userData.tokenString);
                        localStorage.setItem(
                            'user',
                            JSON.stringify(userData.user)
                        );
                        this.decodedToken = this.jwtHelper.decodeToken(
                            userData.tokenString
                        );
                        console.log('decoded', this.decodedToken);
                        this.userToken = userData.tokenString;
                        this.currentUser = userData.user;
                        if (this.currentUser.photoUrl !== null) {
                            this.changeMemberPhoto(this.currentUser.photoUrl);
                        } else {
                            this.changeMemberPhoto('../../assets/user.png');
                        }
                    }
                }),
                catchError(this.handleError)
            );
    }

    register(user: User) {
        return this.http
            .post(this.baseUrl + 'register', user, this.getHeader())
            .pipe(
                map(() => {}),
                catchError(this.handleError)
            );
    }

    private getHeader() {
        const headers = new HttpHeaders({ 'Content-type': 'application/json' });
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
            if (
                typeof serverError === 'string' ||
                serverError instanceof String
            ) {
                modelStateErrors = <string>serverError;
            } else {
                for (const key in serverError) {
                    if (serverError[key]) {
                        modelStateErrors += serverError[key] + '\n';
                    }
                }
            }
        }
        return throwError(modelStateErrors || 'Server error');
    }
}
