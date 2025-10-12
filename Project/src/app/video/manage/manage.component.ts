import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  sort$: BehaviorSubject<string>
  videoOrder = '1';
  clips: IClip[] = []
  activeClip: IClip | null = null

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modalService: ModalService
  ) { 
    this.sort$ = new BehaviorSubject(this.videoOrder)
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params: Params) => {
      this.videoOrder = params['sort'] === '2' ? params['sort'] : '1'
      this.sort$.next(this.videoOrder)
    
    })
    this.clipService.getUserClips(this.sort$).pipe(takeUntil(this.destroy$)).subscribe(docs => {
      this.clips = []
      docs.forEach(doc => {
        this.clips.push({
          docId: doc.id,
          ...doc.data()
        })
      })
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  sort($event: Event) {
    const { value } = ($event.target as HTMLSelectElement)

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    })
  }

  openEditClipModal($event: Event, clip: IClip) {
    $event.preventDefault()
    this.activeClip = clip;
    this.modalService.toggleModal('editClip')
  }

  updateClip($event: IClip) {
    this.clips.forEach((element, index) => {
      if(element.docId == $event.docId) {
        this.clips[index].title  = $event.title
      }
    })
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault()
    console.log(clip)
    
    this.clipService.deleteClip(clip)

    this.clips.forEach((element, index) => {
      if(element.docId == clip.docId) {
        this.clips.splice(index,1)
      }
    })
  }

  async copyToClipboard($event: MouseEvent, clipId: string | undefined) {
    $event.preventDefault()

    if(!clipId) {
      return
    }

    const url = `${location.origin}/clip/${clipId}`

    await navigator.clipboard.writeText(url)

    alert('Link Copied!')
  }
}
