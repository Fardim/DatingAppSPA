import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AlertifyService } from './../_services/alertify.service';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { User } from '../_models/User';
import { UserService } from '../_services/user.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MemberListResolver implements Resolve<User[]> {
    
    constructor(private userService: UserService, private alertify: AlertifyService, private router: Router) {
    }
    
    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
        return this.userService.getUsers().pipe(catchError(error => {
            this.alertify.error('Problem Retrieving Data');
            this.router.navigate(['/home']);
            return of(null);
        }));
    }
}