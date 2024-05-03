import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  isDragover = false
  file: File | null = null
  formIsVisible = false
  showAlert = false
  alertColor = 'red'
  alertMsg = 'You must upload a mp4 video!'

  constructor() { }

  ngOnInit(): void {
  }

  storeFile($event: Event): void {
    this.isDragover = false;

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null

    if (!this.file || this.file.type !== 'video/mp4') {
      this.showAlert = true;
    }
    else {
      this.formIsVisible = true;
      this.showAlert = false;
    }

    console.log(this.file)
  }

}
