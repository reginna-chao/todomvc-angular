import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})

// Init 要執行的項目
// 1. 取得 ToDo List 資料
// 2. 取得 Active Category
// 3. 顯示 Active Category List

export class TodoService {

  // private TODOS: Todo[] = [
  //   { text: 'Taste JavaScript 456', completed: true },
  //   { text: 'Buy a unicorn 123', completed: false }
  // ];

  TODOS: Todo[] = [];

  // Subject
  updateTodos$ = new BehaviorSubject<Todo[]>([]);

  storageKey = 'todomvc-angular-demo';

  constructor() {
    const todoStorage = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    if (todoStorage && todoStorage.length > 0) {
      this.TODOS = todoStorage;
      this.updateTodos$.next(this.TODOS);
    }

    this.updateTodos$.subscribe(() => {
      this.setStorage();
    })
  }

  /**
   * Set Category
   * @param category : string [all|actvie|completed]
   * @returns Not thing, just stop function.
   */
  setCategory(category: string): void {
    if (category === 'active') {
      this.updateTodos$.next(this.TODOS.filter(todo => !todo.completed));
      return;
    } else if (category === 'completed') {
      this.updateTodos$.next(this.TODOS.filter(todo => todo.completed));
      return;
    }
    this.updateTodos$.next(this.TODOS);
  }

  // Control all todo elements

  toggleTodosState(state: boolean): void {
    this.TODOS.forEach(todo => {
      todo.completed = state;
    });
    this.updateTodos$.next(this.TODOS);
  }

  clearCompleted(): void {
    this.TODOS = this.TODOS.filter(todo => !todo.completed);
    this.updateTodos$.next(this.TODOS);
  }

  getTodosLength(): Number {
    return this.TODOS.length;
  }

  getTodosUncompletedLength(): Number {
    return this.TODOS.filter(todo => !todo.completed).length;
  }

  // Control todo element

  addTodo(newTodo: string): void {
    this.TODOS.push(new Todo(newTodo));
    this.updateTodos$.next(this.TODOS);
  }

  /**
   * Way1: use todo to find object in todos
   * @param todo: Object
   */
  // removeTodo(todo: Todo): void {
  //   this.TODOS.splice(this.TODOS.indexOf(todo), 1);
  //   this.updateTodos$.next(this.TODOS);
  // }

  /**
   * Way2: use uid to find obejct in todos
   * @param uid: string - uuid
   */
  removeTodo(uid: string): void {
    const todo = this._findUid(uid);
    if (!todo) return;
    this.TODOS.splice(this.TODOS.indexOf(todo), 1);
    this.updateTodos$.next(this.TODOS);
  }

  updateTodoState(): void {
    this.updateTodos$.next(this.TODOS);
  }

  setStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.TODOS));
  }

  _findUid(uid: string): Todo | undefined {
    return this.TODOS.find(todo => todo.uid === uid);
  }

}
