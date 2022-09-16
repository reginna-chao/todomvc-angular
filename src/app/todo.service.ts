import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private apiUrl: string = environment.apiUrl;
  private todosUrl: string = `${this.apiUrl}/todos`;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'appliction/json'})
  };

  pageNumber: number = 1; // 目前頁面
  pageLimit: number = 5; // 單頁面數量
  pageSize: number = 1; // 總頁面數
  totalCount: number = 0; // 總任務數量

  TODOS: Todo[] = []; // 總任務
  TODOS_PAGE: Todo[] = []; // 頁面上顯示的資料

  // Subject
  updateTodos$ = new BehaviorSubject<Todo[]>([]);

  constructor(private http: HttpClient) {
    // 取得全部任務（為了計算到底有幾項未完成）、總任務數量
    this.getTodos()
      .subscribe(resp => {
        this.TODOS = resp.body || [];
        this.totalCount = Number(resp.headers.get('X-Total-Count'));
        this.pageSize = Math.ceil(this.totalCount / this.pageLimit);
        this.updateTodos$.next(this.TODOS);
      });

    // 取得單頁面 TODOS
    // this.getTodosPage(this.pageNumber)
    //   .subscribe(resp => {
    //     this.TODOS_PAGE = resp || [];
    //     this.updateTodos$.next(this.TODOS_PAGE);
    //   });
  }

  getTodos() {
    return this.http.get<any>(this.todosUrl, {observe: 'response'})
  }

  getTodosPage(page: number) {
    return this.http.get<any>(`${this.todosUrl}?_page=${page}&_limit=${this.pageLimit}`)
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

  addTodo(newTodo: string): Observable<Todo> {
    console.log(newTodo);
    return this.http.post<Todo>(this.todosUrl, new Todo(newTodo), this.httpOptions).pipe(
      tap(data => {
        console.log(data)
        this.updateTodos$.next(this.TODOS);
      })
    )
    // this.TODOS.push(new Todo(newTodo));
    // this.updateTodos$.next(this.TODOS);
  }

  removeTodo(id: number)  {
    console.log('service: removeTodo', id)
    this.http.delete(`${this.todosUrl}/${id}`, this.httpOptions);
  }

  updateTodoState(): void {
    this.updateTodos$.next(this.TODOS);
  }

}
