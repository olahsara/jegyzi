import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { toDatePipe } from '../../../note/pipes/to-date.pipe';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { ModifyRequest, ModifyRequestStatus } from '../../../shared/models/modifiy-request.model';
import { ModifyRequestService } from '../../../shared/services/modify-request.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';
import { ModifyRequestStatusBadgeComponent } from '../modify-request-status-badge/modify-request-status-badge.component';

export interface ModifyRequestEditModalData {
  request: ModifyRequest;
}

@Component({
  selector: 'jegyzi-modify-request-edit-modal',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, FORM_DIRECTIVES, AvatarComponent, toDatePipe, ModifyRequestStatusBadgeComponent],
  templateUrl: './modify-request-edit-modal.component.html',
  styleUrl: './modify-request-edit-modal.component.scss',
})
export class ModifyRequestEditModalComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ModifyRequestEditModalComponent>);
  readonly data = inject<ModifyRequestEditModalData>(MAT_DIALOG_DATA);

  private requestService = inject(ModifyRequestService);
  private destroyRef = inject(DestroyRef);

  hideDeclineNote = signal(true);

  form = new FormGroup({
    declineNote: new FormControl<string | null>(null),
    status: new FormControl<boolean>(true),
  });

  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.hideDeclineNote.set(value.status ? true : false);
    });
  }

  close() {
    this.form.reset();
    this.dialogRef.close(false);
  }

  submit() {
    const newRequest = this.data.request;
    newRequest.status = this.form.value.status ? ModifyRequestStatus.ACCEPTED : ModifyRequestStatus.DECLINED;

    if (this.form.value.status) {
      this.requestService.acceptModifyRequest(this.data.request).then(() => {
        this.form.reset();
        this.dialogRef.close(true);
      });
    } else {
      this.requestService.declineModifyRequest(this.data.request, this.form.value.declineNote as string).then(() => {
        this.form.reset();
        this.dialogRef.close(true);
      });
    }
  }
}
