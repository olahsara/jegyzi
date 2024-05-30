import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai-preview';
import { firebaseConfig } from "../ignore/firebase_options";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from "@angular/material/tooltip";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideVertexAI(() => getVertexAI()),
    provideAnimationsAsync(),
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: { position: 'above' } as MatTooltipDefaultOptions },
  ]
};
