import { Component, OnInit } from '@angular/core';

import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent implements OnInit {
  category: String = 'all';
  count: Number = 0;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.updateTodos$.subscribe(() => {
      // Update count
      this.count = this.todoService.getTodosUncompletedLength();
    });
  }

  setCategory(category: String): void {
    this.category = category;
    this.todoService.setCategory(category);
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
  }
}
