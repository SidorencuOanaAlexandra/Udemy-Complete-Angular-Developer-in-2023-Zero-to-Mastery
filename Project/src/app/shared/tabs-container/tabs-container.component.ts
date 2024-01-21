import { Component, AfterContentInit, OnInit, ContentChild } from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.css']
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChild(TabComponent) tabs = {}

  constructor() { }

  ngAfterContentInit(): void {
    console.log(this.tabs);
  }

}
