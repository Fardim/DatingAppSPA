import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from "./../_services/auth.service";
import { Component, OnInit } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
    selector: "app-nav",
    templateUrl: "./nav.component.html",
    styleUrls: ["./nav.component.css"]
})
export class NavComponent implements OnInit {
    model: any = {};

    constructor(private authService: AuthService, private alertify: AlertifyService, private router: Router) { }

    ngOnInit() { }

    login() {
        this.authService.login(this.model).subscribe(() => {
            this.alertify.success('successfully logged in');
        }, error => {
            this.alertify.error(error);
        }, () => {
            this.router.navigate(['/members']);
        });
    }
    logout() {
        this.authService.userToken = null;
        localStorage.removeItem("token");
        this.alertify.messge("Logged out");
        this.router.navigate(['/home']);
        // this.authService.logout();
    }
    loggedIn() {
        // const token = localStorage.getItem("token");
        // return !!token;
        return this.authService.loggedIn();
    }
}
