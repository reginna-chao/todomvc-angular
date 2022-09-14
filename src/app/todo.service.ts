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

  constructor() { }

  /**
   * Set Category
   * @param category : String [all|actvie|completed]
   * @returns Not thing, just stop function.
   */
  setCategory(category: String): void {
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

  addTodo(newTodo: String): void {
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
   * @param uid: String - uuid
   */
  removeTodo(uid: String): void {
    const todo = this._findUid(uid);
    if (!todo) return;
    this.TODOS.splice(this.TODOS.indexOf(todo), 1);
    this.updateTodos$.next(this.TODOS);
  }

  updateTodoState(): void {
    this.updateTodos$.next(this.TODOS);
  }

  _findUid(uid: String): Todo | undefined {
    return this.TODOS.find(todo => todo.uid === uid);
  }

}
