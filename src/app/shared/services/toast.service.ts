import { Injectable } from '@angular/core';
import { GlobalConfig, IndividualConfig, ToastrService } from 'ngx-toastr';

export const TOASTR_CONFIG: Partial<GlobalConfig> = {
    enableHtml: true,
    positionClass: 'toast-bottom-center',
    iconClasses: {
      error: 'jegyzi-toast-error ph-x-circle ph-bold',
      success: 'jegyzi-toast-success ph-check-circle ph-bold',
    },
    toastClass: 'jegyzi-toast',
    preventDuplicates: true,
  };

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  success(message: string, config?: Partial<IndividualConfig>) {
    return this.toastr.success(message, undefined, config);
  }

  error(message?: string, config?: Partial<IndividualConfig>) {
    return this.toastr.error(message, undefined, config);
  }
}