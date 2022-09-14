import { Component, OnInit } from '@angular/core';

import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent implements OnInit {
  category: string = 'all';
  count: Number = 0;

  storageKey = `${this.todoService.storageKey}-category`

  constructor(private todoService: TodoService) {
    const categoryStorage = localStorage.getItem(this.storageKey);
    if (categoryStorage) {
      this.category = categoryStorage;
      this.todoService.setCategory(this.category);
    }
  }

  ngOnInit(): void {
    this.todoService.updateTodos$.subscribe(() => {
      // Update count
      this.count = this.todoService.getTodosUncompletedLength();
    });
  }

  setCategory(category: string): void {
    this.category = category;
    this.todoService.setCategory(category);
    localStorage.setItem(this.storageKey, category);
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
  }
}
