import { PaginatedResult } from './../../_models/Pagination';
import { map } from 'rxjs/operators';
import { AlertifyService } from './../../_services/alertify.service';
import { User } from './../../_models/User';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/_models/Pagination';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
    users: User[];
    user: User = JSON.parse(localStorage.getItem('user'));
    genderList = [
        { value: 'male', display: 'Males' },
        { value: 'female', display: 'Females' }
    ];
    userParams: any = {};
    pagination: Pagination;
    constructor(
        private userService: UserService,
        private alertify: AlertifyService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // this.loadUsers();
        this.route.data.subscribe(data => {
            this.users = data['users'].result;
            this.pagination = data['users'].pagination;
        });
        this.userParams.gender =
            this.user.gender === 'male' ? 'female' : 'male';
        console.log(this.userParams.gender);

        this.userParams.minAge = 18;
        this.userParams.maxAge = 99;
        this.userParams.orderBy = 'lastActive';
    }

    loadUsers() {
        this.userService
            .getUsers(
                this.pagination.currentPage,
                this.pagination.itemsPerPage,
                this.userParams
            )
            .subscribe((paginatedResult: PaginatedResult<User[]>) => {
                console.log('paginatedResult', paginatedResult);
                this.users = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
            });
    }

    resetFilters() {
        this.userParams.gender =
            this.user.gender === 'male' ? 'female' : 'male';
        this.userParams.minAge = 18;
        this.userParams.maxAge = 99;
        this.loadUsers();
    }

    pageChanged(event: any) {
        console.log('eevent', event);
        this.pagination.currentPage = event.page;
        this.pagination.itemsPerPage = event.itemsPerPage;
        this.loadUsers();
    }
}
