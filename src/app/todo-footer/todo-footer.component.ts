import { Component, OnInit } from '@angular/core';

import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent implements OnInit {
  category: string = 'all';
  count: Number = 0;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.updateTodos$.subscribe(() => {
      // Update count
      this.count = this.todoService.getTodosUncompletedLength();
    });

    this.todoService.category$.subscribe(newCategory => {
      this.category = newCategory;
    })
  }

  setCategory(category: string): void {
    this.category = category;
    this.todoService.setCategory(category).subscribe();
  }

  clearCompleted(): void {
    this.todoService.clearCompleted();
  }
}
