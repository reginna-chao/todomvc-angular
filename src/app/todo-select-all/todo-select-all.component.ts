import { Component, OnDestroy, OnInit } from '@angular/core';

import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-select-all',
  templateUrl: './todo-select-all.component.html',
  styleUrls: ['./todo-select-all.component.scss']
})
export class TodoSelectAllComponent implements OnInit, OnDestroy {
  completedAll: boolean = false;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.updateTodos$.subscribe(() => {
      this.completedAll = this.todoService.getTodosUncompletedLength() === 0;
    })
  }

  ngOnDestroy(): void {
    this.todoService.updateTodos$.unsubscribe();
  }

  toggleTodosState(): void {
    this.todoService.toggleTodosState(this.completedAll);
  }

}
