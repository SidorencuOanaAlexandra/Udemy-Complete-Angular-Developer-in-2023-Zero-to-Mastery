import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';

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
  title = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  uploadForm = new FormGroup({
    title: this.title
  }, [])
  isSubmission = false
  percentage = 0

  constructor(private storage: AngularFireStorage) { }

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
      this.title.setValue(
        this.file.name.replace(/\.[^/.]+$/, '')
      )
    }
  }

  uploadFile() {
    this.showAlert = true;
    this.alertColor = 'blue'
    this.alertMsg = 'Plase wait! Your clip is being uploaded.'
    this.isSubmission = true;
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`


    console.log(clipFileName)

    const task = this.storage.upload(clipPath, this.file)

    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100

    })
  }

}
