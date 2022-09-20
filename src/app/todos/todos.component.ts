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
  title = 'todos';

  todos: Todo[] = [];
  count: number = 0;
  uncompletedCount: number = 0;

  // 分類
  category: string = '';

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
    this.todoService.updateTodos$.subscribe((data) => {
      if (!data.pages) return;

      const { todos, pages, category } = data;
      const todoService = this.todoService;

      this.todos = todos || todoService.TODOS;
      this.category = category || todoService.category;
      this.pageNumber = pages.page || todoService.pageNumber;
      this.pageSize = pages.size || todoService.pageSize;
      this.uncompletedCount = typeof pages.uncompletedCount === 'number' ? pages.uncompletedCount : todoService.uncompletedCount;
      this.count = pages.totalCount || todoService.totalCount;
    });
  }

  setRoute(): void {
    const category: string = this.route.snapshot.paramMap.get('category') || 'all';
    const page: number = Number(this.route.snapshot.paramMap.get('page')) || 1;

    if (category !== this.category) {
      this.category = category;
      this.todoService.getTodos(page, category).subscribe();
    }
  }

  onChangePage(page: number = 1): void {
    this.todoService.getTodos(page, this.category);
  }

  onChangeCategory(category: string = 'all'): void {
    this.todoService.getTodos(1, category);
  }

  onClearCompleted(): void {
    this.todoService.clearCompleted().subscribe();
  }

}
