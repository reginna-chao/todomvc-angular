import { Component, OnInit } from '@angular/core';

import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent implements OnInit {
  category: String = '';

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.category = this.getCategory();
  }

  getCategory(): String {
    return this.todoService.getCategory();
  }

  updateCategory(category: String): void {
    this.todoService.updateCategory(category);
    this.category = this.getCategory();
  }
}
