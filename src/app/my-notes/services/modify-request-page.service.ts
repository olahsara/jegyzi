import { inject, Injectable, signal } from '@angular/core';
import { explicitEffect } from 'ngxtension/explicit-effect';
import { ModifyRequest, ModifyRequestStatus } from '../../shared/models/modifiy-request.model';
import { ModifyRequestService } from '../../shared/services/modify-request.service';
import { UserService } from '../../shared/services/user.service';

@Injectable()
/** A módosítási kérések oldalt kezelő szolgáltatás  */
export class ModifyRequestPageService {
  private modifRequestService = inject(ModifyRequestService);
  private userService = inject(UserService);

  /** Bejelentkezett felhasználó */
  private user = this.userService.user;

  /** Folyamatban lévő kérések */
  inProgressModifyRequests$ = signal<Promise<ModifyRequest[]> | undefined>(undefined);
  /** Elfogadott kérések */
  acceptedModifyRequests$ = signal<Promise<ModifyRequest[]> | undefined>(undefined);
  /** Teljesített kérések */
  doneModifyRequests$ = signal<Promise<ModifyRequest[]> | undefined>(undefined);
  /** Saját kérések */
  ownModifyRequests$ = signal<Promise<ModifyRequest[]> | undefined>(undefined);

  /** Kérések inicializálása */
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

  /** Listák frissítése */
  reload() {
    if (this.user()) {
      this.inProgressModifyRequests$.set(
        this.modifRequestService.getAllModfiyRequestsByNoteCreatorAndStatus(this.user()!.id, ModifyRequestStatus.SUBMITTED),
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
