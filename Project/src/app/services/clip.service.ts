import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import IClip from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, combineLatest, map, of, switchMap } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>
  pageClips: IClip[] = []
  pendingReq = false

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    this.clipsCollection = db.collection('clips')
  }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data)
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([this.auth.user, sort$]).pipe(
      switchMap(values => {
        const [user, sort] = values
        if(!user) {
          return of([])
        }
        console.log('getUserClips')
        const query = this.clipsCollection.ref.where('uid', '==', user.uid).orderBy('timestamps', sort === '1' ? 'desc' : 'asc')

        return query.get()
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    )
  }

  updateClip(clipId: string, title: string) {
    return this.clipsCollection.doc(clipId).update({
      title
    })
  }

  async deleteClip(clip: IClip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`)
    const screenshotRef = this.storage.ref(`screenshots/${clip.screenshotFileName}`)

    await clipRef.delete()
    await screenshotRef.delete()
    await this.clipsCollection.doc(clip.docId).delete()
  }

  async getClips() {
    if(this.pendingReq) {
      return
    }

    this.pendingReq = true
    let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6)

    const { length } = this.pageClips

    if (length) {
      const lastDocID = this.pageClips[length - 1].docId
      const lastDoc = await this.clipsCollection.doc(lastDocID)
        .get()
        .toPromise()

      query = query.startAfter(lastDoc)
    }

    const snapshot = await query.get()

    snapshot.forEach(doc => {
      this.pageClips.push({
        docId: doc.id,
        ...doc.data()
      })
    })

    this.pendingReq = false
  }
}
