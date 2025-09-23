import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';

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
  showPercentage = false
  user: firebase.User | null = null

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService
  ) {
    this.auth.user.subscribe(user => this.user = user)
  }

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
    this.uploadForm.disable()
    this.showAlert = true;
    this.alertColor = 'blue'
    this.alertMsg = 'Plase wait! Your clip is being uploaded.'
    this.isSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`

    const task = this.storage.upload(clipPath, this.file)
    const clipRef = this.storage.ref(clipPath)

    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100
    })

    task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipRef.getDownloadURL())
    ).subscribe({
      next: (url) => {
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url
        } as IClip

        this.clipService.createClip(clip)

        this.alertColor = 'green'
        this.alertMsg = 'Your clip was being uploaded with succes!'
        this.showPercentage = false
      },
      error: (error) => {
        this.uploadForm.enable()
        this.alertColor = 'red'
        this.alertMsg = 'Upload failed! Plase try again later!'
        this.isSubmission = true
        this.showPercentage = false
      }
    })
  }
}
