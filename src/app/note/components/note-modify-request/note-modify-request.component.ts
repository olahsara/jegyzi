import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModifyRequest, ModifyRequestSeriusness, ModifyRequestStatus } from '../../../shared/models/modifiy-request.model';
import { Note } from '../../../shared/models/note.model';
import { User } from '../../../shared/models/user.model';
import { ModifyRequestService } from '../../../shared/services/modify-request.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';

export interface ModifyRequestModalData {
  creator: User;
  note: Note;
}

@Component({
  selector: 'jegyzi-note-modify-request',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, FORM_DIRECTIVES],
  templateUrl: './note-modify-request.component.html',
  styleUrl: './note-modify-request.component.scss',
})
export class NoteModifyRequestModalComponent {
  readonly dialogRef = inject(MatDialogRef<NoteModifyRequestModalComponent>);
  readonly data = inject<ModifyRequestModalData>(MAT_DIALOG_DATA);
  private requestService = inject(ModifyRequestService);

  /** Új módosítási kéréshez szükséges űrlap */
  form = new FormGroup({
    date: new FormControl<Timestamp>(Timestamp.fromDate(new Date())),
    seriousness: new FormControl<ModifyRequestSeriusness | null>(null),
    description: new FormControl<string | null>(null),
    creatorId: new FormControl<string | null>(this.data.creator.id),
    creatorName: new FormControl<string | null>(this.data.creator.name),
    noteId: new FormControl<string | null>(this.data.note.id),
    noteTitle: new FormControl<string | null>(this.data.note.title),
    noteCreator: new FormControl<string | null>(this.data.note.creatorId),
    status: new FormControl<ModifyRequestStatus>(ModifyRequestStatus.SUBMITTED),
  });
  modifyRequestSeriusness = ModifyRequestSeriusness;

  /** Modál ablak bezárása */
  close() {
    this.form.reset();
    this.dialogRef.close(false);
  }

  /** Új módosítási kérés készítése */
  submit() {
    this.requestService.createModifyRequest(this.form.value as ModifyRequest, this.data.note).then(() => {
      this.form.reset();
      this.dialogRef.close(true);
    });
  }
}
