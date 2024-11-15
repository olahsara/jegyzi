import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { ModifyRequest, ModifyRequestStatus } from '../../../shared/models/modifiy-request.model';
import { ElapsedTimePipe } from '../../../shared/pipes/elapsed-time.pipe';
import { toDatePipe } from '../../../shared/pipes/to-date.pipe';
import { ModifyRequestService } from '../../../shared/services/modify-request.service';
import { ModifyRequestEditModalComponent } from '../../components/modify-request-edit-modal/modify-request-edit-modal.component';
import { ModifyRequestStatusBadgeComponent } from '../../components/modify-request-status-badge/modify-request-status-badge.component';
import { ModifyRequestPageService } from '../../services/modify-request-page.service';

@Component({
  selector: 'jegyzi-modify-request-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    AvatarComponent,
    toDatePipe,
    ElapsedTimePipe,
    ModifyRequestStatusBadgeComponent,
    MatTooltipModule,
    MatExpansionModule,
  ],
  templateUrl: './modify-request-list-page.component.html',
  styleUrl: './modify-request-list-page.component.scss',
  providers: [ModifyRequestPageService],
})
export class ModifyRequestListPagesComponent {
  private modifRequestService = inject(ModifyRequestService);
  private pageService = inject(ModifyRequestPageService);
  private dialog = inject(MatDialog);

  /** A komponens szolgáltatásától lekért kérések listák */
  inProgressModifyRequests$ = this.pageService.inProgressModifyRequests$;
  acceptedModifyRequests$ = this.pageService.acceptedModifyRequests$;
  doneModifyRequests$ = this.pageService.doneModifyRequests$;
  ownModifyRequests$ = this.pageService.ownModifyRequests$;

  modifyRequestStatus = ModifyRequestStatus;

  /**
   * Módosítási kérés módosítása
   * @param request kérés
   */
  editRequest(request: ModifyRequest) {
    this.dialog
      .open(ModifyRequestEditModalComponent, { minWidth: '60vw', maxHeight: '90vh', data: { request: request } })
      .afterClosed()
      .subscribe(() => {
        this.pageService.reload();
      });
  }

  /**
   * Módosítási kérés teljesítetté állítása
   * @param request kérés
   */
  doneRequest(request: ModifyRequest) {
    this.modifRequestService.doneModifyRequest(request).then(() => {
      this.pageService.reload();
    });
  }

  /**
   * Módosítási kérés törlése
   * @param request kérés
   */
  deleteRequest(request: ModifyRequest) {
    this.modifRequestService.deleteModifyRequest(request).then(() => {
      this.pageService.reload();
    });
  }
}
