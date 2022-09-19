import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private todosUrl: string = `${environment.apiUrl}/todos`;

  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json' })
  };

  loading$ = new BehaviorSubject<boolean>(false);

  // 資料
  TODOS: Todo[] = []; // 顯示的總任務
  TODOS_CATEGORY: Todo[] = [];
  TODOS_VIEW: Todo[] = []; // 頁面上顯示的資料

  // 分類
  category: string = 'all';

  // Page
  pageNumber: number = 1; // 目前頁面
  pageLimit: number = 5; // 單頁面數量
  pageSize: number = 1; // 總頁面數

  // 任務數量
  totalCount: number = 0; // 總任務數量
  unCompletedCount: number = 0; // 未完成總數量

  // Subject
  updateTodos$ = new BehaviorSubject<Todo[]>([]);
  updateTodosCategory$ = new Subject<Todo[]>();

  constructor(private http: HttpClient) {
    this.getTodos();

    this.updateTodosCategory$.subscribe(() => {
      this.setPage(this.pageNumber);
    })
  }


  getTodos(): Observable<any> {
    const dataConfig$ = this.http.get(this.todosUrl);
    dataConfig$.subscribe((data: any) => {
      this.TODOS = data;
      this.updateTodos();
    })

    return dataConfig$;
  }

  getTodosPage(page: number = 1): Observable<any> {
    return this.http.get<any>(`${this.todosUrl}?_page=${page}&_limit=${this.pageLimit}`)
  }

  getTodosCategory(completed: boolean = false): Observable<any> {
    return this.http.get<any>(`${this.todosUrl}?completed=${completed}`)
  }

  getTodosCategoryPage(page: number = 1, completed: boolean = false): Observable<any> {
    return this.http.get<any>(`${this.todosUrl}?_page=${page}&_limit=${this.pageLimit}&completed=${completed}`)
  }

  getTodosLength(): Number {
    return this.TODOS.length;
  }

  setData(data: Todo[]): void {
    console.log(this.TODOS_VIEW)
    this.TODOS_VIEW = data;
    this.totalCount = this.TODOS.length;
    this.unCompletedCount = this.TODOS.filter(item => !item.completed).length;
    this.updateTodos$.next(data);
  }

  setCategory(category: string): void {
    this.category = category;
    if (category !== 'all') {
      this.getTodosCategory(category === 'completed').subscribe((data) => {
        this.TODOS_CATEGORY = data;
        this.updateTodosCategory$.next(data);
        this.updateTodos$.next(data);
      })
    }
    this.TODOS_CATEGORY = this.TODOS;
    this.updateTodosCategory$.next(this.TODOS_CATEGORY);
    this.updateTodos$.next(this.TODOS_CATEGORY);
  }

  setPage(page: number): void {
    console.log('TODOS_CATEGORY?????', this.TODOS_CATEGORY, Math.ceil(this.TODOS_CATEGORY.length / this.pageLimit));
    this.pageNumber = page;
    this.pageSize = Math.ceil(this.TODOS_CATEGORY.length / this.pageLimit);
    this.pageSize = this.pageSize === 0 ? 1 : this.pageSize;
  }

  updateTodos(page: number = this.pageNumber, category: string = this.category): void {
    console.log('updateTodos', page, category);
    this.pageNumber = page;
    this.category = category;

    if (category === 'all') {
      this.getTodosPage(page).subscribe((data) => {
        this.afterUpdateTodos(page, category, data);
      });
    } else {
      this.getTodosCategoryPage(page, category === 'completed').subscribe((data) => {
        this.afterUpdateTodos(page, category, data);
      })
    }
  }

  afterUpdateTodos(page: number, category: string, data: any): void {
    this.setData(data);
    this.setCategory(category);
    this.setPage(page);
  }

  // Control all todo elements

  toggleTodosState(state: boolean): void {
    this.TODOS.map((todo) => {
      todo.completed = state;
      this.updateTodo(todo).subscribe();
    });
  }

  clearCompleted(): void {
    this.TODOS.map((todo) => {
      todo.completed && this.removeTodo(todo.id).subscribe();
    });
  }

  // Control single todo element

  addTodo(newTodoText: string): Observable<Todo> {
    return this.http.post<Todo>(this.todosUrl, new Todo(newTodoText), this.httpOptions).pipe(
      tap((data) => {
        this.TODOS.push(data);
        this.updateTodos();
        this.updateTodosCategory$.subscribe(() => {
          if (this.pageNumber < this.pageSize) {
            this.pageNumber = this.pageSize;
            // this.updateTodos();
          }
        })
      })
    );
  }

  removeTodo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.todosUrl}/${id}`, this.httpOptions).pipe(
      tap(() => {
        const todo = this._findId(id);
        if (!todo) return;
        this.TODOS.splice(this.TODOS.indexOf(todo), 1);
        this.updateTodos();
        this.updateTodosCategory$.subscribe(() => {
          if (this.pageNumber > this.pageSize) {
            this.pageNumber = this.pageSize;
            this.updateTodos();
          }
        })
      })
    );
  }

  updateTodo(todo: Todo): Observable<any> {
    return this.http.put<Todo>(`${this.todosUrl}/${todo.id}`, todo, this.httpOptions).pipe(
      tap((data: any) => {
        const todo = this._findId(data.id);
        if (!todo) return;
        this.TODOS[this.TODOS.indexOf(todo)] = data;
        this.updateTodos();
      })
    );
  }

  private _findId(id: number): Todo | undefined {
    return this.TODOS.find(item => item.id === id);
  }

}
