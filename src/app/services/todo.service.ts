import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private apiUrl: string = environment.apiUrl;
  private todosUrl: string = `${this.apiUrl}/todos`;
  private summaryUrl: string = `${this.apiUrl}/summary`;

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json' })
  };

  loading$ = new BehaviorSubject<boolean>(false);

  // 資料
  TODOS: Todo[] = []; // 顯示的任務

  // 分類
  category: string = 'all';

  // Page
  pageNumber: number = 1; // 目前頁面
  pageLimit: number = 5; // 單頁面數量
  pageSize: number = 1; // 總頁面數

  // 任務數量
  totalCount: number = 0; // 總任務數量
  uncompletedCount: number = 0; // 未完成總數量

  // Subject
  updateTodos$ = new BehaviorSubject<any>({});

  constructor(
    private http: HttpClient,
    private location: Location
  ) { }

  getTodos(page: number = this.pageNumber, category: string = this.category): Observable<any> {
    let dataConfig$ = null;
    if (category === 'all') {
      dataConfig$ = this.http.get(`${this.summaryUrl}?_page=${page}&_limit=${this.pageLimit}`);
    } else {
      dataConfig$ = this.http.get(`${this.summaryUrl}?_page=${page}&_limit=${this.pageLimit}&completed=${category === 'completed'}`);
    }
    dataConfig$.subscribe((data: any) => {
      const { todos, pages } = data;

      this.pageNumber = pages.page;
      this.pageSize = pages.size;

      this.uncompletedCount = pages.uncompletedCount;
      this.totalCount = pages.totalCount;

      this.category = category;

      this.TODOS = todos;

      data.category = category;

      this.updateTodos$.next(data);
    })
    return dataConfig$;
  }

  toggleTodosState(state: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/all?completed=${state}`, {}, this.httpOptions).pipe(
      tap(() => {
        this.getTodos();
      })
    );
  }

  clearCompleted(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/completed`, this.httpOptions).pipe(
      tap(() => {
        this._checkPageSize();
      })
    )
  }

  // Control single todo element

  addTodo(newTodoText: string): Observable<Todo> {
    return this.http.post<Todo>(this.todosUrl, new Todo(newTodoText), this.httpOptions).pipe(
      tap(() => {
        this.category = this.category !== 'completed' ? this.category : 'all';
        this._checkPageSize('toLastPage');
      })
    );
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.todosUrl}/${id}`, this.httpOptions).pipe(
      tap(() => {
        this._checkPageSize();
      })
    );
  }

  updateTodo(todo: Todo): Observable<any> {
    return this.http.put<any>(`${this.todosUrl}/${todo.id}`, todo, this.httpOptions).pipe(
      tap(() => {
        this._checkPageSize();
      })
    );
  }

  private _checkPageSize(type?: string): void {
    this.getTodos().subscribe(({pages}) => {
      const condition = type === 'toLastPage' ? pages.size > pages.page : pages.size < pages.page;
      if (condition) {
        this.location.replaceState(`/todos/${this.category}/${pages.size}`);
        this.getTodos(pages.size, this.category);
      }
    });
  }

}
