import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from './../_models/Pagination';
import { Message } from './../_models/Message';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import * as _ from 'underscore';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
    messages: Message[];
    pagination: Pagination;
    messageContainer: string;
    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private authService: AuthService,
        private alertify: AlertifyService
    ) {}

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.messages = data['messages'].result;
            this.pagination = data['messages'].pagination;
        });
        this.messageContainer = 'Unread';
    }

    loadMessages() {
        this.userService
            .getMessages(
                this.authService.decodedToken.nameid,
                this.pagination.currentPage,
                this.pagination.itemsPerPage,
                this.messageContainer
            )
            .subscribe((paginatedResult: PaginatedResult<Message[]>) => {
                this.messages = paginatedResult.result;
                this.pagination = paginatedResult.pagination;
            });
    }

    pageChanged(event: any) {
        console.log('eevent', event);
        this.pagination.currentPage = event.page;
        this.pagination.itemsPerPage = event.itemsPerPage;
        this.loadMessages();
    }

    deleteMessage(id: number) {
        this.alertify.confirm(
            'Are you sure you want to delete the message?',
            () => {
                this.userService
                    .deleteMessage(this.authService.decodedToken.nameid, id)
                    .subscribe(
                        () => {
                            this.messages.splice(
                                _.findIndex(this.messages, { id: id }),
                                1
                            );
                            this.alertify.success('Message has been deleted');
                        },
                        error => {
                            this.alertify.error('Failed to delete the message');
                        }
                    );
            }
        );
    }
}
