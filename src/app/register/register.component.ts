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
    constructor(private authService: AuthService) { }

    ngOnInit() { }
    register() {
        this.authService.register(this.model).then(val => {
            console.log('regval', val);
        }).catch(error => {
            console.log('regerror', error);
        });
    }
    cancel() {
        this.cancelRegister.emit(false);
    }
}
