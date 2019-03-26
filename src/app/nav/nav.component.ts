import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from "./../_services/auth.service";
import { Component, OnInit } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"]
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(private authService: AuthService, private alertify: AlertifyService) {}

  ngOnInit() {}

  login() {
    this.authService.login(this.model).subscribe(()=> {
      this.alertify.success('successfully logged in');
    }, error => {
      this.alertify.error(error);
    });
  }
  logout() {
    this.authService.userToken = null;
    localStorage.removeItem("token");
    this.alertify.messge("Logged out");
    // this.authService.logout();
  }
  loggedIn() {
    // const token = localStorage.getItem("token");
    // return !!token;
    return this.authService.loggedIn();
  }
}
