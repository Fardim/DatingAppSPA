import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from "./../_services/auth.service";
import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.css"]
})
export class RegisterComponent implements OnInit {
    model: any = {};
    @Output() cancelRegister: EventEmitter<boolean> = new EventEmitter();
    constructor(private authService: AuthService, private alertify: AlertifyService) { }

    ngOnInit() { }

    register() {
        this.authService.register(this.model).subscribe(() => {
            this.alertify.success('Registration succcessful');
        }, error => {
            this.alertify.error(error);
        });
    }

    cancel() {
        this.cancelRegister.emit(false);
    }
}
