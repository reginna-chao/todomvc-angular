import { Injectable } from '@angular/core';

import { ITodo, Todo } from './todo';

@Injectable({
  providedIn: 'root'
})

// Init 要執行的項目
// 1. 取得 ToDo List 資料
// 2. 取得 Active Category
// 3. 顯示 Active Category List

export class TodoService {

  CATEGORY: String = 'all';

  TODOS: ITodo[] = [
    { text: 'Taste JavaScript 456', completed: true },
    { text: 'Buy a unicorn 123', completed: false }
  ]

  ALL_COMPLETED: boolean = false; // 是否全部完成

  constructor() { }

  // Category

  getCategory(): String {
    return this.CATEGORY;
  }

  updateCategory(category: String): void {
    this.CATEGORY = category;
  }

  // List

  getTodosAll(): ITodo[] {
    return this.TODOS;
  }

  getTodosActive(): ITodo[] {
    return this.TODOS.filter(item => !item.completed);
  }

  getTodosCompleted(): ITodo[] {
    return this.TODOS.filter(item => item.completed);
  }

  // 操作項目

  addTodo(title: String): void {
    this.TODOS.push({...new Todo(title)});
  }

  removeTodo(todo: ITodo): void{
    this.TODOS.slice(this.TODOS.indexOf(todo), 1);
  }

  // 全選相關

  getCompletedAll(): boolean {
    return this.ALL_COMPLETED;
  }

  // 全選
  completedAll(): void {
    this.TODOS.forEach(item => {
      item.completed = true;
    })
  }

}
