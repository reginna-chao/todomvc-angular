export interface ITodo {
  text: String,
  completed: boolean
}

export class Todo {
  text: String;
  completed: boolean;

  constructor(text: String) {
    this.text = text.trim();
    this.completed = false;
  }
}
