import { inject, Injectable, signal } from '@angular/core';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { ModifyRequest, ModifyRequestStatus } from '../../shared/models/modifiy-request.model';
import { ModifyRequestService } from '../../shared/services/modify-request.service';
import { UserService } from '../../shared/services/user.service';

@Injectable()
export class ModifyRequestPageService {
  private modifRequestService = inject(ModifyRequestService);
  private userService = inject(UserService);

  private user = this.userService.user;

  inProgressModifyRequests$ = signal<Promise<ModifyRequest[]> | undefined>(undefined);
  acceptedModifyRequests$ = signal<Promise<ModifyRequest[]> | undefined>(undefined);
  doneModifyRequests$ = signal<Promise<ModifyRequest[]> | undefined>(undefined);
  ownModifyRequests$ = signal<Promise<ModifyRequest[]> | undefined>(undefined);

  constructor() {
    explicitEffect([this.user], ([user]) => {
      if (user) {
        this.inProgressModifyRequests$.set(
          this.modifRequestService.getAllModfiyRequestsByNoteCreatorAndStatus(user.id, ModifyRequestStatus.SUBMITTED),
        );
        this.acceptedModifyRequests$.set(
          this.modifRequestService.getAllModfiyRequestsByNoteCreatorAndStatus(user.id, ModifyRequestStatus.ACCEPTED),
        );
        this.doneModifyRequests$.set(
          this.modifRequestService.getAllModfiyRequestsByNoteCreatorAndStatus(user.id, ModifyRequestStatus.DONE),
        );
        this.ownModifyRequests$.set(this.modifRequestService.getAllModfiyRequestsByCreator(user.id));
      }
    });
  }

  reload() {
    if (this.user()) {
      this.inProgressModifyRequests$.set(
        this.modifRequestService.getAllModfiyRequestsByNoteCreatorAndStatus(this.user()!.id, ModifyRequestStatus.IN_PROGRESS),
      );
      this.acceptedModifyRequests$.set(
        this.modifRequestService.getAllModfiyRequestsByNoteCreatorAndStatus(this.user()!.id, ModifyRequestStatus.ACCEPTED),
      );
      this.doneModifyRequests$.set(
        this.modifRequestService.getAllModfiyRequestsByNoteCreatorAndStatus(this.user()!.id, ModifyRequestStatus.DONE),
      );
      this.ownModifyRequests$.set(this.modifRequestService.getAllModfiyRequestsByCreator(this.user()!.id));
    }
  }
}
