import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai-preview';
import {firebaseConfig} from "../ignore/firebase_options";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp(firebaseConfig)), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideVertexAI(() => getVertexAI())]
};
