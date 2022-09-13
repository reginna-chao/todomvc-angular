import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoSelectAllComponent } from './todo-select-all.component';

describe('TodoSelectAllComponent', () => {
  let component: TodoSelectAllComponent;
  let fixture: ComponentFixture<TodoSelectAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoSelectAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoSelectAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
