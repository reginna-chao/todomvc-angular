import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-pagination',
  templateUrl: './todo-pagination.component.html',
  styleUrls: ['./todo-pagination.component.scss']
})
export class TodoPaginationComponent implements OnInit {
  // Ref: https://michalmuszynski.com/blog/pagination-component-in-angular/
  @Input() pageNumber: number = 1; // 目前頁面
  @Input() pageSize: number = 1; // 總頁面數
  @Input() category: string = ''; // 分類
  @Output() onChangePage: EventEmitter<number> = new EventEmitter<number>();

  private _currentPage: number = 1;

  get currentPage(): number {
    return this._currentPage;
  }

  set currentPage(page: number) {
    this._currentPage = page;
    this.onChangePage.emit(this.currentPage);
  }

  constructor() { }

  ngOnInit(): void { }

  prevPage(): void {
    this.currentPage -= 1;
  }

  nextPage(): void {
    this.currentPage += 1;
  }

}
