import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TodosComponent } from './todos/todos.component';

const routes: Routes = [
  { path: '', redirectTo: '/todos/all/1', pathMatch: 'full' },
  { path: 'todos/:category/:page', component: TodosComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
