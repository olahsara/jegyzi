import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai-preview';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions } from '@angular/material/tooltip';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { provideToastr } from 'ngx-toastr';
import { firebaseConfig } from '../ignore/firebase_options';
import { routes } from './app.routes';
import { TOASTR_CONFIG } from './shared/services/toast.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideVertexAI(() => getVertexAI()),
    provideAnimationsAsync(),
    provideToastr(TOASTR_CONFIG),
    importProvidersFrom(NgxSkeletonLoaderModule.forRoot()),
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { position: 'above' } as MatTooltipDefaultOptions },
    { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },
  ],
};
