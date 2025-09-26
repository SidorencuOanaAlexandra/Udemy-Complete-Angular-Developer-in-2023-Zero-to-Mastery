import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null
  modalId = 'editClip'
  clipId = new FormControl('')
  title = new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ])
  editForm = new FormGroup({
    clipId: this.clipId,
    title: this.title
  },)
  showAlert: boolean = false
  alertColor: string = ''
  alertMessage: string = 'Please wait! Uploading clip.'
  inSubmission: boolean = false


  constructor(
    private modal: ModalService,
    private clipService: ClipService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.editForm.invalid)
    if (!this.activeClip) {
      return
    }

    this.clipId.setValue(this.activeClip.docId)
    this.title.setValue(this.activeClip.title)
  }
  
  ngOnInit(): void {
    this.modal.registerModal(this.modalId)
  }

  ngOnDestroy(): void {
    this.modal.unregisterModal(this.modalId)
  }

  async submit() {
    this.inSubmission = true
    this.alertColor = 'blue'
    this.showAlert = true
    this.alertMessage = 'Please wait! Uploading the clip.'

    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value)
    }
    catch(e) {
      this.inSubmission = false;
      this.alertColor = 'red'
      this.alertMessage = 'Something went wrong. Try again later'
    }

    this.inSubmission = false;
    this.alertColor = 'green'
    this.alertMessage = 'Succes!'

    setTimeout(x => {

    },1000)
  }
}
