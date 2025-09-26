import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
  modalId = 'editClip'

  constructor(private modal: ModalService) { }
  
  ngOnInit(): void {
    this.modal.registerModal(this.modalId)
  }

  ngOnDestroy(): void {
    this.modal.unregisterModal(this.modalId)
  }
}
