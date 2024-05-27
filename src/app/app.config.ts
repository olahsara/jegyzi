import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getVertexAI, provideVertexAI } from '@angular/fire/vertexai-preview';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"jegyzi-2024","appId":"1:89465141980:web:35aae91f2964ac8f9f9219","storageBucket":"jegyzi-2024.appspot.com","apiKey":"AIzaSyDvZQX1t50xHZUE8feKl9sJJFsVFrWlIgw","authDomain":"jegyzi-2024.firebaseapp.com","messagingSenderId":"89465141980"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideVertexAI(() => getVertexAI())]
};
