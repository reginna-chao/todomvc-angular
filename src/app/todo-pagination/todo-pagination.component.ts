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

  constructor() { }

  ngOnInit(): void { }

  prevPage(): void {
    this.onChangePage.emit(this.pageNumber - 1);
  }

  nextPage(): void {
    this.onChangePage.emit(this.pageNumber + 1);
  }

}
