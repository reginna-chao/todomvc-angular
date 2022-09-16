import { Component, OnInit, Input, ElementRef, ViewChildren, QueryList } from '@angular/core';

import { Todo } from '../todo';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent implements OnInit {
  @Input() todo?: Todo;

  // Get ngIf hide element
  // Ref: https://stackoverflow.com/a/51567261/11240898
  @ViewChildren("editTodo") editTodo: QueryList<ElementRef> | undefined;

  editing = false;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (!this.editTodo) return;
    this.editTodo.changes.subscribe(() => {
      this.setFocus();
    });
  }

  setFocus() {
    if (this.editTodo && this.editTodo.length > 0) {
      this.editTodo.first.nativeElement.focus();
    }
  }

  removeTodo(): void {
    // Solve: Object is possibly 'undefined'.ts(2532)
    if (!this.todo) return;

    this.todoService.removeTodo(this.todo.id).subscribe();
  }

  // Update todo completed state for update count.
  updateTodo(todo: Todo): void {
    console.log(todo)
    this.todoService.updateTodo(todo).subscribe();
  }

  showEdit(): void {
    this.editing = true;
  }

  hideEdit(editTodoEl: any): void {
    this.editing = false;

    // // Solve: Object is possibly 'undefined'.ts(2532)
    if (!this.todo) return;

    if (editTodoEl.value.length !== 0) {
      this.todo.text = editTodoEl.value;
      this.updateTodo(this.todo);
    } else {
      this.removeTodo();
    }
  }

  cancelEdit(editTodoEl: any): void {
    this.editing = false;

    // Solve: Object is possibly 'undefined'.ts(2532)
    if (!this.todo) return;

    editTodoEl.value = this.todo.text;
  }

}
