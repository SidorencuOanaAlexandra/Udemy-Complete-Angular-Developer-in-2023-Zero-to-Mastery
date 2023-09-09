import {
  Component, Input, EventEmitter, Output, OnInit, OnChanges,
  DoCheck, SimpleChanges, AfterContentInit, AfterContentChecked,
  AfterViewInit, AfterViewChecked
} from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnChanges, DoCheck, AfterContentInit,
  AfterContentChecked, AfterViewInit, AfterViewChecked {
  @Input('img') postImg = '';
  @Output() imgSelected = new EventEmitter<string>()

  constructor() {
    //console.log("constructor");
  }

  ngAfterViewChecked(): void {
    console.log("ngAfterViewChecked");
  }
  ngAfterViewInit(): void {
    console.log("ngAfterViewInit");
  }
  ngAfterContentChecked(): void {
    console.log("ngAfterContentChecked");
  }
  ngAfterContentInit(): void {
    console.log("ngAfterContentInit");
  }

  ngDoCheck(): void {
    //console.log("ngDoCheck");
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log("ngOnChanges");
  }

  ngOnInit(): void {
    console.log("ngOnInit");
  }

}
