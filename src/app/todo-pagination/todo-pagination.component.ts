import { Component, OnInit } from '@angular/core';

import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-pagination',
  templateUrl: './todo-pagination.component.html',
  styleUrls: ['./todo-pagination.component.scss']
})
export class TodoPaginationComponent implements OnInit {
  pageNumber: number = 1;
  pageSize: number = 1;
  hasPage: boolean = this.pageSize > 1;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.updateTodos$.subscribe(() => {
      this.getPageData();
    })
  }

  getPageData(): void {
    this.todoService.getPageData()
      .subscribe((data: any) => {
        this.pageNumber = data.pageNumber;
        this.pageSize = data.pageSize;
        this.hasPage = this.pageSize > 1;
      })
  }

  changePage(newPageNumber: number): void {
    this.todoService.getTodosPage(newPageNumber).subscribe(resp => {
      this.pageNumber = newPageNumber;
    });
  }

  prevPage(): void {
    this.changePage(this.pageNumber - 1);
  }

  nextPage(): void {
    this.changePage(this.pageNumber + 1);
  }

}
