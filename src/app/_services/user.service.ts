import { Message } from './../_models/Message';
import { PaginatedResult } from './../_models/Pagination';
import { catchError, tap } from 'rxjs/operators';
import { User } from './../_models/User';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getUsers(
        page?: number,
        itemsPerPage?: number,
        userParams?: any,
        likesParam?: string
    ): Observable<PaginatedResult<User[]>> {
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
            User[]
        >();
        let queryString = '?';
        if (page != null && itemsPerPage != null) {
            queryString +=
                'pageNumber=' + page + '&pageSize=' + itemsPerPage + '&';
        }
        if (userParams != null) {
            queryString +=
                'minAge=' +
                userParams.minAge +
                '&maxAge=' +
                userParams.maxAge +
                '&gender=' +
                userParams.gender +
                '&orderBy=' +
                userParams.orderBy +
                '&';
        }
        if (likesParam != null) {
            if (likesParam == 'Likers') queryString += 'Likers=true';
            else queryString += 'Likees=true';
        }
        return this.http
            .get(this.baseUrl + 'users' + queryString, { observe: 'response' })
            .pipe(
                map((response: HttpResponse<Object>) => {
                    console.log('response', response);
                    paginatedResult.result = <User[]>response.body;
                    if (response.headers.get('pagination') != null) {
                        paginatedResult.pagination = JSON.parse(
                            response.headers.get('pagination')
                        );
                    }
                    return paginatedResult;
                }),
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

    sendLike(userid: number, recipientId: number) {
        return this.http
            .post(this.baseUrl + 'users/' + userid + '/like/' + recipientId, {})
            .pipe(
                map(() => {}),
                catchError(this.handleError)
            );
    }

    getMessages(
        userid: number,
        page?: number,
        itemsPerPage?: number,
        messageContainer?: string
    ): Observable<PaginatedResult<Message[]>> {
        const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
            Message[]
        >();
        let queryString = '?';
        if (page != null && itemsPerPage != null) {
            queryString +=
                'pageNumber=' + page + '&pageSize=' + itemsPerPage + '&';
        }
        if (messageContainer != null) {
            queryString += 'messageContainer=' + messageContainer;
        }
        return this.http
            .get(this.baseUrl + 'users/' + userid + '/messages' + queryString, {
                observe: 'response'
            })
            .pipe(
                map((response: HttpResponse<Object>) => {
                    console.log('response', response);
                    paginatedResult.result = <Message[]>response.body;
                    if (response.headers.get('pagination') != null) {
                        paginatedResult.pagination = JSON.parse(
                            response.headers.get('pagination')
                        );
                    }
                    return paginatedResult;
                }),
                catchError(this.handleError)
            );
    }

    getMessageThread(
        userid: number,
        recipientId: number
    ): Observable<Message[]> {
        return this.http
            .get(
                this.baseUrl +
                    'users/' +
                    userid +
                    '/messages/thread/' +
                    recipientId
            )
            .pipe(
                map((messages: Message[]) => {
                    return messages;
                }),
                catchError(this.handleError)
            );
    }

    sendMessage(userid: number, message: Message) {
        return this.http
            .post(this.baseUrl + 'users/' + userid + '/messages', message)
            .pipe(
                map((message: Message) => {
                    return message;
                }),
                catchError(this.handleError)
            );
    }

    deleteMessage(userid: number, id: number) {
        return this.http
            .post(this.baseUrl + 'users/' + userid + '/messages/' + id, {})
            .pipe(
                map(response => {}),
                catchError(this.handleError)
            );
    }

    markAsRead(userid: number, messageId: number) {
        return this.http
            .post(
                this.baseUrl +
                    'users/' +
                    userid +
                    '/messages/' +
                    messageId +
                    '/read',
                {}
            )
            .subscribe();
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
        if (error.status === 400) {
            console.log(error);
            return throwError(error.error);
        }
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
