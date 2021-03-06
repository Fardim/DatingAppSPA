import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { MessagesResolver } from './_resolvers/message.resolver';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { AuthModule } from './auth/auth.module';
import { MemberListComponent } from './members/member-list/member-list.component';
import { UserService } from './_services/user.service';
import { AuthGuard } from './_guards/auth.guard';
import { AlertifyService } from './_services/alertify.service';
import { AuthService } from './_services/auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ValueComponent } from './value/value.component';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { NgxGalleryModule } from 'ngx-gallery';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimeAgoPipe } from 'time-ago-pipe';
import { PaginationModule } from 'ngx-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    declarations: [
        AppComponent,
        ValueComponent,
        NavComponent,
        HomeComponent,
        RegisterComponent,
        MemberListComponent,
        ListsComponent,
        MessagesComponent,
        MemberCardComponent,
        MemberDetailComponent,
        MemberEditComponent,
        PhotoEditorComponent,
        TimeAgoPipe,
        MemberMessagesComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BsDropdownModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        AuthModule,
        TabsModule.forRoot(),
        NgxGalleryModule,
        FileUploadModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        PaginationModule.forRoot(),
        ButtonsModule.forRoot(),
        NgxSpinnerModule
    ],
    providers: [
        AuthService,
        AlertifyService,
        AuthGuard,
        PreventUnsavedChangesGuard,
        UserService,
        MemberDetailResolver,
        MemberListResolver,
        MemberEditResolver,
        ListsResolver,
        MessagesResolver,
        ErrorInterceptorProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
