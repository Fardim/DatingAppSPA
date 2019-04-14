import { AuthService } from './../_services/auth.service';
import { Observable, of } from 'rxjs';
import { AlertifyService } from './../_services/alertify.service';
import { Resolve, Router } from '@angular/router';
import { User } from './../_models/User';
import { UserService } from '../_services/user.service';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
    
    constructor(private userService: UserService, private alertify: AlertifyService, private router: Router, private authService: AuthService) {}
    
    resolve(): Observable<User> {
        return this.userService.getUser(+this.authService.decodedToken.nameid).pipe(catchError(error => {
            this.alertify.error('Problem Retrieving Data');
            this.router.navigate(['/members']);
            return of(null);
        }));
    }
}