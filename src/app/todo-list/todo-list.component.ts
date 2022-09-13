import { Component, OnInit } from '@angular/core';

import { ITodo } from '../todo';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: ITodo[] = [];

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.getTodosAll();
  }

  getTodosAll(): void {
    this.todos = this.todoService.getTodosAll();
  }

}
