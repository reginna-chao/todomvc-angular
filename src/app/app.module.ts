import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TodoFooterComponent } from './todo-footer/todo-footer.component';
import { TodoInputComponent } from './todo-input/todo-input.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TitleComponent } from './title/title.component';
import { TodoSelectAllComponent } from './todo-select-all/todo-select-all.component';
import { TodoPaginationComponent } from './todo-pagination/todo-pagination.component';

@NgModule({
  declarations: [
    AppComponent,
    TodoFooterComponent,
    TodoInputComponent,
    TodoItemComponent,
    TodoListComponent,
    TitleComponent,
    TodoSelectAllComponent,
    TodoPaginationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
