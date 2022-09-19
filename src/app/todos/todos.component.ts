import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  count: number = 0;
  unCompletedCount: number = 0;

  // 分類
  category: string = 'all';

  // Page
  pageNumber: number = 1; // 目前頁面
  pageSize: number = 1; // 總頁面數

  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
    this.setRoute();
    this.setSubscibe();
  }

  ngOnDestroy(): void {
   this.todoService.updateTodos$.unsubscribe();
  }

  setSubscibe(): void {
    this.todoService.updateTodos$.subscribe(() => {
      this.todos = this.todoService.TODOS_VIEW;
      this.count = this.todoService.totalCount;
      this.unCompletedCount = this.todoService.unCompletedCount;

      this.category = this.todoService.category;

      this.pageNumber = this.todoService.pageNumber;
      this.pageSize = this.todoService.pageSize;
    });
  }

  setRoute(): void {
    this.route.url.subscribe(r => {
      const category: string = this.route.snapshot.paramMap.get('category') || 'all';
      const page: number = Number(this.route.snapshot.paramMap.get('page')) || 1;

      this.todoService.updateTodos(page, category);
    })
  }

  onChangePage(page: number = 1): void {
    this.todoService.updateTodos(page, this.category);
  }

  onChangeCategory(category: string = 'all'): void {
    this.todoService.updateTodos(this.pageNumber, category);
  }

  onClearCompleted(): void {
    this.todoService.clearCompleted();
  }

  onToggleTodosState(completed: boolean): void {
    this.todoService.toggleTodosState(completed);
  }
}
