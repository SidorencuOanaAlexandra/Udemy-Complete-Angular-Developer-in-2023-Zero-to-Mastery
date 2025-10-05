import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  providers: [DatePipe]
})
export class ClipsListComponent implements OnInit, OnDestroy {
  @Input() isScrollable = true

  constructor(public clipService: ClipService) { 
    this.clipService.getClips()
    console.log(clipService.pageClips)
  }

  ngOnInit(): void {
    if(this.isScrollable) {
      window.addEventListener('scroll', this.handleScroll)
    }
  }

  handleScroll = () => {
    const { scrollTop, offsetHeight}  = document.documentElement
    const { innerHeight } = window

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight

    if(bottomOfWindow) {
      console.log("request data")
      this.clipService.getClips()
    }
  }

  ngOnDestroy(): void {
    if(this.isScrollable) {
      window.removeEventListener('scroll', this.handleScroll)    
    }
  }
}
