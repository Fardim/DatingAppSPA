import { MessagesResolver } from './_resolvers/message.resolver';
import { ListsResolver } from './_resolvers/lists.resolver';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { AuthGuard } from './_guards/auth.guard';
import { ListsComponent } from './lists/lists.component';
import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';

export const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {
                path: 'members',
                component: MemberListComponent,
                resolve: { users: MemberListResolver }
            },
            {
                path: 'members/:id',
                component: MemberDetailComponent,
                resolve: { user: MemberDetailResolver }
            },
            {
                path: 'member/edit',
                component: MemberEditComponent,
                resolve: { user: MemberEditResolver },
                canDeactivate: [PreventUnsavedChangesGuard]
            },
            {
                path: 'messages',
                component: MessagesComponent,
                resolve: { messages: MessagesResolver }
            },
            {
                path: 'lists',
                component: ListsComponent,
                resolve: { users: ListsResolver }
            }
        ]
    },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
