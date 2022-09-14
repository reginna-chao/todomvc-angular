import { v4 as uuid } from 'node-uuid';

export class Todo {
  uid: string;
  text: string;
  completed: boolean;

  setText(newText: string): void {
    this.text = newText.trim();
  }

  constructor(text: string) {
    this.uid = uuid();
    this.text = text.trim();
    this.completed = false;
  }
}
