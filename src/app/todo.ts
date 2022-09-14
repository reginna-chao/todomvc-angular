import { v4 as uuid } from 'node-uuid';

export class Todo {
  uid: String;
  text: String;
  completed: boolean;

  setText(newText: String): void {
    this.text = newText.trim();
  }

  constructor(text: String) {
    this.uid = uuid();
    this.text = text.trim();
    this.completed = false;
  }
}
