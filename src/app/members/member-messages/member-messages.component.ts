import { Message } from './../../_models/Message';
import { AlertifyService } from './../../_services/alertify.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { tap, map } from 'rxjs/operators';
import * as _ from 'underscore';

@Component({
    selector: 'app-member-messages',
    templateUrl: './member-messages.component.html',
    styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
    @Input() userid: number;
    messages: Message[];
    newMessage: any = {};
    constructor(
        private userService: UserService,
        private alertify: AlertifyService,
        private authService: AuthService
    ) {}

    ngOnInit() {
        this.loadMessageThread();
    }

    loadMessageThread() {
        const currentUserId = +this.authService.decodedToken.nameid;
        this.userService
            .getMessageThread(currentUserId, this.userid)
            .pipe(
                tap((messages: Message[]) => {
                    _.forEach(messages, (message: Message) => {
                        if (
                            message.isRead === false &&
                            message.recipientId === currentUserId
                        ) {
                            this.userService.markAsRead(
                                currentUserId,
                                message.id
                            );
                        }
                    });
                })
            )
            .subscribe(
                (messages: Message[]) => {
                    this.messages = messages;
                },
                error => {
                    this.alertify.error(error);
                }
            );
    }

    sendMessage() {
        this.newMessage.recipientId = this.userid;
        this.userService
            .sendMessage(this.authService.decodedToken.nameid, this.newMessage)
            .subscribe(
                message => {
                    this.messages.unshift(message);
                    this.newMessage.content = '';
                },
                error => {
                    this.alertify.error(error);
                }
            );
    }
}
