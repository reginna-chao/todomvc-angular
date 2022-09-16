import { Component } from '@angular/core';

import { TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = '01_todolist_angular';
  count: Number = 0;

  constructor(private todoService: TodoService ) {
    this.todoService.updateTodos$.subscribe(todo => {
      this.count = this.todoService.getTodosLength();
    })
  }
}
