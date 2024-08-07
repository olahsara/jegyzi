import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai-preview';
import { firebaseConfig } from "../ignore/firebase_options";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from "@angular/material/tooltip";
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideToastr } from 'ngx-toastr';
import { TOASTR_CONFIG } from './shared/services/toast.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
    ),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideVertexAI(() => getVertexAI()),
    provideAnimationsAsync(),
    provideToastr(TOASTR_CONFIG),
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { position: 'above' } as MatTooltipDefaultOptions },
    { provide: FIREBASE_OPTIONS, useValue: firebaseConfig }
  ]
};
