import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-todo-footer',
  templateUrl: './todo-footer.component.html',
  styleUrls: ['./todo-footer.component.scss']
})
export class TodoFooterComponent implements OnInit {
  @Input() category: string = 'all';
  @Input() count: Number = 0;
  @Output() onChangeCategory: EventEmitter<string> = new EventEmitter<string>();
  @Output() onClearCompleted: EventEmitter<string> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void { }

  setCategory(category: string): void {
    this.onChangeCategory.emit(category);
  }

  clearCompleted(): void {
    this.onClearCompleted.emit();
  }
}
