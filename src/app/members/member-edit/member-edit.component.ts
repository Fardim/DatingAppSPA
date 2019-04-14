import { AuthService } from './../../_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from './../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { User } from './../../_models/User';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { catchError } from 'rxjs/operators';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
    user: User;
    photoUrl: string;
    @ViewChild('editForm') editForm: NgForm;
    constructor(
        private route: ActivatedRoute,
        private alertify: AlertifyService,
        private userService: UserService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.user = data['user'];
            console.log('user', this.user);
        });
        this.authService.currentPhotoUrl.subscribe(
            photoUrl => (this.photoUrl = photoUrl)
        );
    }

    updateUser() {
        this.userService
            .updateUser(this.authService.decodedToken.nameid, this.user)
            .subscribe(
                next => {
                    this.alertify.success('Updated successfully');
                    this.editForm.reset(this.user);
                },
                error => {
                    this.alertify.error(error);
                }
            );
    }

    updateMainPhoto(photoUrl) {
        this.user.photoUrl = photoUrl;
    }
}
