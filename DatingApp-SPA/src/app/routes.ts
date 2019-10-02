import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MmeberEditComponent } from './members/mmeber-edit/mmeber-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';

export const appRoutes: Routes = [
    {path: '' , component: HomeComponent},
    {
        path : '',
        runGuardsAndResolvers : 'always',
        canActivate : [AuthGuard],
        children: [
            {path: 'members' , component: MemberListComponent , resolve : {users : MemberListResolver}},
            {path: 'members/:id' , component: MemberDetailsComponent , resolve : { user : MemberDetailResolver} },

            {path: 'member/edit' , component: MmeberEditComponent, resolve: {user : MemberEditResolver} ,
            canDeactivate: [PreventUnsavedChanges]},
            {path: 'messages' , component: MessagesComponent, resolve: { messages : MessagesResolver}},
            {path: 'lists' , component: ListsComponent, resolve: {users : ListsResolver}},
        ]
    },
    {path: '**' , redirectTo : '', pathMatch: 'full'}
];