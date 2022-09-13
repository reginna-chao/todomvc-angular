import { Component, OnInit } from '@angular/core';

import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-select-all',
  templateUrl: './todo-select-all.component.html',
  styleUrls: ['./todo-select-all.component.scss']
})
export class TodoSelectAllComponent implements OnInit {


  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
  }

}
