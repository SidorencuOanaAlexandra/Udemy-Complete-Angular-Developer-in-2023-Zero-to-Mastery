import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isReady = false;
  isrunning = false;
  private ffmpeg

  constructor(private auth: AngularFireAuth) { 
    this.ffmpeg = createFFmpeg({log: true})
  }

  async init() {
    if(this.isReady)
      return

    await this.ffmpeg.load()

    this.isReady = true
  }

  async getScreenshots(file: File) {
    this.isrunning = true;
    const data = await fetchFile(file)

    this.ffmpeg.FS('writeFile', file.name, data)

    const seconds = ['03','05','07']
    const commands: string[] = []

    seconds.forEach(second => {
      commands.push(
        //input
        '-i', file.name,
        //output options
        '-ss', `00:00:${second}`,
        '-frames:v', '1',
        '-filter:v', 'scale=510:287',
        //outpu
        `output_${second}.png`
      )
    })

    await this.ffmpeg.run(
      ...commands
    )

    const screenshots: string[] = []

    seconds.forEach(second => {
      const screenshotFile = this.ffmpeg.FS('readFile', `output_${second}.png`)
      const screenshotBlob = new Blob(
        [screenshotFile.buffer], {
          type: 'image/img'
        }
      )
      const screenshotURL = URL.createObjectURL(screenshotBlob)

      screenshots.push(screenshotURL)

    })

    this.isrunning = false;
      return screenshots
  }

  async blobFromURL(url: string) {
    const response = await fetch(url)
    const blob = await response.blob()

    return blob
  }
}
