import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai-preview';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { QuillModule } from 'ngx-quill';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { provideToastr } from 'ngx-toastr';
import { firebaseConfig } from '../environment/environment';
import { routes } from './app.routes';
import { AuthService } from './shared/services/auth.service';
import { TOASTR_CONFIG } from './shared/services/toast.service';
import { UserService } from './shared/services/user.service';

function appInit(authService: AuthService, userService: UserService) {
  return async () => {
    const user = authService.auth.user;
    user.subscribe((data) => {
      if (data) {
        userService.getUserById(data.uid).then((element) => {
          userService.setUser(element[0]);
        });
      }
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() => initializeApp(firebaseConfig || {})), //hogy a ci pipline lefusson
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideVertexAI(() => getVertexAI()),
    provideAnimationsAsync(),
    provideToastr(TOASTR_CONFIG),
    importProvidersFrom(
      NgxSkeletonLoaderModule.forRoot(),
      QuillModule.forRoot({
        modules: {
          toolbar: true,
        },
      }),
    ),
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { position: 'above' } as MatTooltipDefaultOptions },
    { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },
    { provide: MAT_DATE_LOCALE, useValue: 'hu-HU' },
    { provide: LOCALE_ID, useValue: 'hu' },
    {
      provide: APP_INITIALIZER,
      useFactory: appInit,
      multi: true,
      deps: [AuthService, UserService],
    },
  ],
};
