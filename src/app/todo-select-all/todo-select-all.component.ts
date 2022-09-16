import { Component, OnInit } from '@angular/core';

import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-select-all',
  templateUrl: './todo-select-all.component.html',
  styleUrls: ['./todo-select-all.component.scss']
})
export class TodoSelectAllComponent implements OnInit {
  completedAll: boolean = false;

  constructor(private todoService: TodoService) {
    this.todoService.updateTodos$.subscribe(() => {
      this.completedAll = this.todoService.getTodosUncompletedLength() === 0;
    })
  }

  ngOnInit(): void {
  }

  toggleTodosState(): void {
    this.todoService.toggleTodosState(this.completedAll);
  }

}
