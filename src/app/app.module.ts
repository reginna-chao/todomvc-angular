import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TodoFooterComponent } from './todo-footer/todo-footer.component';
import { TodoInputComponent } from './todo-input/todo-input.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodoSelectAllComponent } from './todo-select-all/todo-select-all.component';
import { TodoPaginationComponent } from './todo-pagination/todo-pagination.component';
import { LoaderComponent } from './loader/loader.component';
import { AppRoutingModule } from './app-routing.module';
import { TodosComponent } from './todos/todos.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoFooterComponent,
    TodoInputComponent,
    TodoItemComponent,
    TodoListComponent,
    TodoSelectAllComponent,
    TodoPaginationComponent,
    LoaderComponent,
    TodosComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
