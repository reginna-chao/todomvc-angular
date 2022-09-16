import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private apiUrl: string = environment.apiUrl;
  private todosUrl: string = `${this.apiUrl}/todos`;

  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json' })
  };

  storageKey: string = 'todomvc-angular-demo';
  storageCategoryKey: string = `${this.storageKey}-category`;

  loading$ = new BehaviorSubject<boolean>(false);

  // Page
  pageNumber: number = 1; // 目前頁面
  pageLimit: number = 5; // 單頁面數量
  pageSize: number = 1; // 總頁面數
  totalCount: number = 0; // 總任務數量

  TODOS: Todo[] = []; // 總任務
  TODOS_VIEW: Todo[] = []; // 頁面上顯示的資料

  category$ = new BehaviorSubject<string>('all'); // 顯示的分類類型

  // Subject
  updateTodos$ = new BehaviorSubject<Todo[]>([]);

  constructor(private http: HttpClient) {
    // 取得全部任務（為了計算到底有幾項未完成）、總任務數量
    this.getTodos()
      .subscribe(data => {
        this.TODOS = data || [];
        // this.updateTodos$.next(this.TODOS); // 顯示全部任務時需要
      });

    // 取得單頁面 TODOS
    this.getTodosPage(this.pageNumber).subscribe(() => {
      this.loading$.next(true);

      const categoryStorage: string | null = localStorage.getItem(this.storageCategoryKey);
      if (categoryStorage) {
        this.category$.next(categoryStorage);
        this.setCategory(categoryStorage).subscribe();
      }
    });

  }

  getTodos(): Observable<any> {
    return this.http.get<any>(this.todosUrl)
  }

  getTodosPage(page: number): Observable<any> {
    return this.http.get<any>(`${this.todosUrl}?_page=${page}&_limit=${this.pageLimit}`, {observe: 'response'}).pipe(
      tap(resp => {
        this.TODOS_VIEW = resp.body || [];
        this.pageNumber = page;
        this.totalCount = Number(resp.headers.get('X-Total-Count'));
        this.pageSize = Math.ceil(this.totalCount / this.pageLimit);
        this.pageSize = this.pageSize > 0 ? this.pageSize : 1;
        this.updateTodos$.next(this.TODOS_VIEW);
      })
    )
  }

  getTodosPageCompletedFilter(page: number, completed: boolean): Observable<any> {
    return this.http.get<any>(`${this.todosUrl}?_page=${page}&_limit=${this.pageLimit}&completed=${completed}`, {observe: 'response'}).pipe(
      tap(resp => {
        this.TODOS_VIEW = resp.body || [];
        this.pageNumber = page;
        this.totalCount = Number(resp.headers.get('X-Total-Count'));
        this.pageSize = Math.ceil(this.totalCount / this.pageLimit);
        this.pageSize = this.pageSize > 0 ? this.pageSize : 1;
        this.updateTodos$.next(this.TODOS_VIEW);
      })
    )
  }

  getPageData(): Observable<object> {
    return of({
      pageNumber: this.pageNumber,
      pageLimit: this.pageLimit,
      pageSize: this.pageSize,
      totalCount: this.totalCount
    })
  }

  /**
   * Set Category
   * @param category : string [all|actvie|completed]
   * @returns Not thing, just stop function.
   */
  setCategory(category: string): Observable<any> {
    this.setCategoryStorage(category);
    if (category === 'active') {
      // this.updateTodos$.next(this.TODOS.filter(todo => !todo.completed));
      return this.getTodosPageCompletedFilter(this.pageNumber, false); // page version
    } else if (category === 'completed') {
      // this.updateTodos$.next(this.TODOS.filter(todo => todo.completed));
      return this.getTodosPageCompletedFilter(this.pageNumber, true); // page version
    }
    // All
    // this.updateTodos$.next(this.TODOS);
    return this.getTodosPage(this.pageNumber); // page version
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
        this.getTodosPage(Math.ceil(this.TODOS.length / this.pageLimit)).subscribe();
      })
    )
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.todosUrl}/${id}`, this.httpOptions).pipe(
      tap(() => {
        const todo = this._findId(id);
        if (!todo) return;
        this.TODOS.splice(this.TODOS.indexOf(todo), 1);

        const lastPage: number = Math.ceil(this.TODOS.length / this.pageLimit);
        const currentPage: number = lastPage > this.pageNumber ? this.pageNumber : lastPage;
        this.getTodosPage(currentPage).subscribe();
      })
    );
  }

  updateTodo(todo: Todo): Observable<any> {
    return this.http.put<Todo>(`${this.todosUrl}/${todo.id}`, todo, this.httpOptions).pipe(
      tap((data: any) => {
        const todo = this._findId(data.id);
        if (!todo) return;
        this.TODOS[this.TODOS.indexOf(todo)] = data;
        this.getTodosPage(this.pageNumber).subscribe();
      })
    )
  }

  updateTodoState(): void {
    this.updateTodos$.next(this.TODOS);
  }

  setCategoryStorage(category: string) {
    localStorage.setItem(this.storageCategoryKey, category);
  }

  private _findId(id: number): Todo | undefined {
    return this.TODOS.find(item => item.id === id);
  }

}
