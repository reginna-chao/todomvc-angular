// 引用 Todo 一樣可以判斷資料格式，所以不使用 interface
// export interface ITodo {
//   uid: string;
//   text: string;
//   completed: boolean;
// }

export class Todo {
  id: any;
  text: string;
  completed: boolean;

  setText(newText: string): void {
    this.text = newText.trim();
  }

  constructor(text: string) {
    this.text = text.trim();
    this.completed = false;
  }
}
