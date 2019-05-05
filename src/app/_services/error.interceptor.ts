import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpHandler,
    HttpEvent,
    HttpRequest,
    HttpErrorResponse,
    HTTP_INTERCEPTORS
} from '@angular/common/http';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status === 400) {
                        console.log(error);
                        return throwError(error.error);
                    }
                    const applicationError = error.headers.get(
                        'Application-Error'
                    );
                    if (applicationError) {
                        return throwError(applicationError);
                    }
                    console.log('err', error);
                    const serverError = error.error;
                    let modelStateErrors = '';
                    if (serverError) {
                        if (
                            typeof serverError === 'string' ||
                            serverError instanceof String
                        ) {
                            modelStateErrors = <string>serverError;
                        } else {
                            for (const key in serverError) {
                                if (serverError[key]) {
                                    modelStateErrors += serverError[key] + '\n';
                                }
                            }
                        }
                    }
                    return throwError(
                        modelStateErrors || serverError || 'Server error'
                    );
                }
            })
        );
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
};
