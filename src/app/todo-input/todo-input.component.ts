import { Component, OnInit } from '@angular/core';
import { Todo } from '../todo';

import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-input',
  templateUrl: './todo-input.component.html',
  styleUrls: ['./todo-input.component.scss']
})
export class TodoInputComponent implements OnInit {
  text: String = '';

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
  }

  addTodo(): void {
    if (this.text.trim() === '') return;
    this.todoService.addTodo(this.text as String);
    this.text = '';
  }

}
