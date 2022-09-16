import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, findIndex, filter } from 'rxjs/operators';

import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private apiUrl: string = environment.apiUrl;
  private todosUrl: string = `${this.apiUrl}/todos`;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json' })
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
        if (!resp.body) return;
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

  getTodos(): Observable<any> {
    return this.http.get<any>(this.todosUrl, {observe: 'response'})
  }

  getTodosPage(page: number): Observable<any> {
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
    this.TODOS.map(todo => {
      if (state && !todo.completed) {
        todo.completed = !todo.completed;
        this.updateTodo(todo).subscribe();
      } else if (!state && todo.completed) {
        todo.completed = !todo.completed;
        this.updateTodo(todo).subscribe();
      }
    })
  }

  clearCompleted(): void {
    this.TODOS.map(todo => {
      if (todo.completed) {
        console.log(todo);
        this.removeTodo(todo.id).subscribe();
      }
    });
  }

  getTodosLength(): Number {
    return this.TODOS.length;
  }

  getTodosUncompletedLength(): Number {
    return this.TODOS.filter(todo => !todo.completed).length;
  }

  // Control todo element

  addTodo(newTodoText: string): Observable<Todo> {
    return this.http.post<Todo>(this.todosUrl, new Todo(newTodoText), this.httpOptions).pipe(
      tap(data => {
        this.TODOS.push(data);
        this.updateTodos$.next(this.TODOS);
      })
    )
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.todosUrl}/${id}`, this.httpOptions).pipe(
      tap(() => {
        const todo = this._findId(id);
        if (!todo) return;
        this.TODOS.splice(this.TODOS.indexOf(todo), 1);
        this.updateTodos$.next(this.TODOS);
      })
    );
  }

  updateTodo(todo: Todo): Observable<any> {
    return this.http.put<Todo>(`${this.todosUrl}/${todo.id}`, todo, this.httpOptions).pipe(
      tap((data: any) => {
        const todo = this._findId(data.id);
        if (!todo) return;
        this.TODOS[this.TODOS.indexOf(todo)] = data;
        this.updateTodos$.next(this.TODOS);
      })
    )
  }

  updateTodoState(): void {
    this.updateTodos$.next(this.TODOS);
  }

  private _findId(id: number): Todo | undefined {
    return this.TODOS.find(item => item.id === id);
  }

}
