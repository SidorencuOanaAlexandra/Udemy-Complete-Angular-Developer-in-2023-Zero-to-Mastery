import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css']
})
export class ClipComponent implements OnInit {
  clipId = ''

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.clipId = this.route.snapshot.params.id
  }
}
