import { catchError } from 'rxjs/operators';
import { User } from './../_models/User';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getUsers(): Observable<User[]> {
        return this.http.get(this.baseUrl + 'users').pipe(
            map((users: User[]) => users),
            catchError(this.handleError)
        );
    }

    getUser(id: number): Observable<User> {
        return this.http.get(this.baseUrl + 'users/' + id).pipe(
            map((user: User) => user),
            catchError(this.handleError)
        );
    }

    updateUser(id: number, user: User) {
        return this.http.put(this.baseUrl + 'users/' + id, user).pipe(
            map(() => {}),
            catchError(this.handleError)
        );
    }

    setMainPhoto(userId: number, photoId: number) {
        return this.http
            .post(
                this.baseUrl +
                    'users/' +
                    userId +
                    '/photos/' +
                    photoId +
                    '/setMain',
                {},
                this.getHeader()
            )
            .pipe(
                map(() => {}),
                catchError(this.handleError)
            );
    }

    deletePhoto(userId: number, photoId: number) {
        return this.http
            .delete(this.baseUrl + 'users/' + userId + '/photos/' + photoId)
            .pipe(
                map(() => {}),
                catchError(this.handleError)
            );
    }

    private getHeader() {
        const headers = new HttpHeaders({ 'Content-type': 'application/json' });
        return { headers: headers };
    }

    jwt() {
        let token = localStorage.getItem('token');
        if (token) {
            const headers = new HttpHeaders({
                'Content-type': 'application/json',
                Authorization: 'Bearer ' + token
            });
            return { headers: headers };
        }
    }
    private handleError(error: any) {
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
            return throwError(applicationError);
        }
        console.log('err', error);
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
