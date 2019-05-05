import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
    const token = localStorage.getItem('token');
    console.log('gotToken', token);
    return token;
}

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                whitelistedDomains: [
                    'localhost:44395',
                    'localhost:5000',
                    'localhost:5001'
                ]
            }
        })
    ]
})
export class AuthModule {}
