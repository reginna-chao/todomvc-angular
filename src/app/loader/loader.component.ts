import { Component, OnInit, OnDestroy } from '@angular/core';

import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  loaded: boolean = false;
  loaderShow: boolean = true;

  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
    this.todoService.loading$.subscribe(value => {
      setTimeout(() => {
        this.loaded = value;
      }, 500);

      setTimeout(() => {
        this.loaderShow = false;
      }, 1500);
    });
  }

  ngOnDestroy(): void {
    this.todoService.loading$.unsubscribe()
  }

}
