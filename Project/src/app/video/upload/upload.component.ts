import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';
import { Route, Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { combineLatest, forkJoin } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit, OnDestroy {
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
  task?: AngularFireUploadTask
  screenshots: string[] = []
  selectedScreenshot: string = ''
  screenshotTask?: AngularFireUploadTask

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    this.auth.user.subscribe(user => this.user = user)
    this.ffmpegService.init()
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  ngOnInit(): void {
  }

  async storeFile($event: Event) {
    if(this.ffmpegService.isrunning) {
      return
    }

    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer ? 
                ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
                ($event.target as HTMLInputElement).files?.item(0) ?? null
                
    if (!this.file || this.file.type !== 'video/mp4') {
      this.showAlert = true;
    }
    else {
      this.screenshots = await this.ffmpegService.getScreenshots(this.file)

      this.selectedScreenshot = this.screenshots[0]

      console.log(this.screenshots)

      this.formIsVisible = true;
      this.showAlert = false;
      this.title.setValue(
        this.file.name.replace(/\.[^/.]+$/, '')
      )
    }
  }

  async uploadFile() {
    this.uploadForm.disable()
    this.showAlert = true;
    this.alertColor = 'blue'
    this.alertMsg = 'Plase wait! Your clip is being uploaded.'
    this.isSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`

    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    )
    const screenshotPath = `screenshots/${clipFileName}.png`

    console.log(screenshotBlob)
    console.log(screenshotPath)

    this.task = this.storage.upload(clipPath, this.file)
    const clipRef = this.storage.ref(clipPath)

    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob)
    const screenshotRef = this.storage.ref(screenshotPath)

    combineLatest([
      this.task.percentageChanges(), 
      this.screenshotTask.percentageChanges()
    ]).subscribe((progress) => {
      const [clipProgress, screenShotProgress] = progress

      if (!clipProgress || !screenShotProgress) {
        return
      }

      this.percentage = (clipProgress + screenShotProgress) as number / 200
    })

    forkJoin([this.task.snapshotChanges(), this.screenshotTask.snapshotChanges()]).pipe(
      switchMap(() => forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()]))
    ).subscribe({
      next: async (urls) => {
        const [clipUrl, screenshotUrl] = urls
        const clip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url: clipUrl,
          screenShotUrl: screenshotUrl,
          screenshotFileName: `${clipFileName}.png`,
          timestamps: firebase.firestore.FieldValue.serverTimestamp()
        } as IClip

        const clipRef = await this.clipService.createClip(clip)

        this.alertColor = 'green'
        this.alertMsg = 'Your clip was being uploaded with succes!'
        this.showPercentage = false

        setTimeout(() => {
          this.router.navigate([
            'clip', clipRef.id
          ])
        }, 1000)
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
