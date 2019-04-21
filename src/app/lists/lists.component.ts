import { PaginatedResult } from './../_models/Pagination';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/_models/Pagination';
import { User } from './../_models/User';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
    users: User[];
    pagination: Pagination;
    likeParam: string;
    constructor(
        private route: ActivatedRoute,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.users = data['users'].result;
            this.pagination = data['users'].pagination;
        });
        this.likeParam = 'Likers';
    }

    loadUsers() {
        this.userService
            .getUsers(
                this.pagination.currentPage,
                this.pagination.itemsPerPage,
                null,
                this.likeParam
            )
            .subscribe((paginatedResult: PaginatedResult<User[]>) => {
                this.users = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
            });
    }

    pageChanged(event: any) {
        console.log('eevent', event);
        this.pagination.currentPage = event.page;
        this.pagination.itemsPerPage = event.itemsPerPage;
        this.loadUsers();
    }
}
