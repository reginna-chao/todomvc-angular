import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];

  constructor(
    private route: ActivatedRoute,
    private todoService: TodoService
  ) { }

  ngOnInit(): void {
    const category: string = this.route.snapshot.paramMap.get('category') || 'all';

    console.log('cate category', category);

    this.todoService.updateTodos$.subscribe(todos => this.todos = todos);
    this.todoService.setCategory(category).subscribe();
  }

  ngOnDestroy(): void {
    this.todoService.updateTodos$.unsubscribe();
  }

}
