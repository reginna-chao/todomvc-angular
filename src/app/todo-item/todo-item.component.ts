import { Component, OnInit, Input } from '@angular/core';

import { ITodo } from '../todo';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input() todo?: ITodo;

  editing = false;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
  }

  removeTodo(todo: ITodo): void {
    console.log('remove', todo)
    this.todoService.removeTodo(todo);
  }

  showEdit(): void {
    console.log('show Edit')
    this.editing = true;
  }

  hideEdit(): void {
    console.log('hide Edit')
    this.editing = false;
  }

}
