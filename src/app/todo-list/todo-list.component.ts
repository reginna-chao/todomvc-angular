import { Component, OnInit } from '@angular/core';

import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.updateTodos$.subscribe(todos => this.todos = todos);
  }

}
