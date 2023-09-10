import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'some name'
  imgUrl = 'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
  currentDate = new Date();
  cost = 2000;
  temperature = 25.3;
  pizza = {
    topping: ['lala', 'l'],
    size: 'lal'
  }
  blueClass = false;
  fontSize = 16;
  images = [
    this.imgUrl,
    this.imgUrl,
    this.imgUrl
  ]


  changeImage(event: KeyboardEvent): void {
    this.imgUrl = (event.target as HTMLInputElement).value;
  }

  logImg(event: string) {
    console.log(event);
  }
}
