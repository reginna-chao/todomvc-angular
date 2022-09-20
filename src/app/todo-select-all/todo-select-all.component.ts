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
      this.completedAll = this.todoService.uncompletedCount === 0;
    })
  }

  ngOnDestroy(): void {
    // 會錯誤
    /**
     * todo.service.ts:55 ERROR ObjectUnsubscribedErrorImpl {
     * stack: 'Error\n    at _super (http://localhost:4200/vendor.…r._next (http://localhost:4200/vendor.js:5889:22)', name: 'ObjectUnsubscribedError', message: 'object unsubscribed'}
     */
    // this.todoService.updateTodos$.unsubscribe();
  }

  toggleTodosState(): void {
    this.todoService.toggleTodosState(this.completedAll).subscribe();
  }

}
