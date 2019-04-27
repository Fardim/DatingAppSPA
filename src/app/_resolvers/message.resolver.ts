import { AuthService } from './../_services/auth.service';
import { Message } from './../_models/Message';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AlertifyService } from '../_services/alertify.service';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from '../_services/user.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
    pageNumber = 1;
    itemsPerPage = 5;
    messageContainer = 'Unread';
    constructor(
        private userService: UserService,
        private authService: AuthService,
        private alertify: AlertifyService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userService
            .getMessages(
                this.authService.decodedToken.nameid,
                this.pageNumber,
                this.itemsPerPage,
                this.messageContainer
            )
            .pipe(
                catchError(error => {
                    this.alertify.error('Problem Retrieving Data' + error);
                    this.router.navigate(['/home']);
                    return of(null);
                })
            );
    }
}
