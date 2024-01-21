import { Component, Input, OnInit, enableProdMode } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() modalId = ''

  constructor(public modal: ModalService) {
  }

  ngOnInit(): void {
  }

  closeModal() {
    this.modal.toggleModal(this.modalId);
  }

}
