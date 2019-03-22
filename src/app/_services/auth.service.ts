import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    baseUrl = "https://localhost:44395/api/auth/";
    userToken: any;

    constructor(private http: HttpClient) { }

    login(model: any) {
        return this.http
            .post(this.baseUrl + "login", model, this.getHeader())
            .subscribe(
                (res: { tokenString: string }) => {
                    const user = res;
                    console.log("res", res);
                    if (user) {
                        localStorage.setItem("token", user.tokenString);
                        this.userToken = user.tokenString;
                        console.log("Successfully logged in");
                    }
                },
                error => {
                    console.log("failed to login");
                }
            );
    }

    register(model) {
        return this.http
            .post(this.baseUrl + "register", model, this.getHeader())
            .toPromise();
    }

    private getHeader() {
        const headers = new HttpHeaders({ "Content-type": "application/json" });
        return { headers: headers };
    }

    logout() {
        this.userToken = null;
        localStorage.removeItem("token");
    }
}
