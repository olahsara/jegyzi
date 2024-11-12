import { inject, Injectable, OnInit } from '@angular/core';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  auth = inject(AngularFireAuth);
  private store = inject(AngularFirestore);
  private userService = inject(UserService);

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  signup(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  async google() {
    const data = await this.auth.signInWithPopup(new GoogleAuthProvider()).then(async (result) => {
      // The signed-in user info.
      const user = result.user;
      console.log(user);
      if (user) {
        const profile = await this.userService.getUserById(user.uid);
        if (!profile.length) {
          const newProfile: User = {
            profilePicture: false,
            email: user.email!,
            name: user.displayName!,
            follow: [],
            followers: [],
            followedNotes: [],
            followersNumber: 0,
            id: user.uid,
            notesNumber: 0,
            reviews: [],
          };
          this.userService.createProfile(newProfile);
        }
      }
    });
    return data;
  }

  loggedInUser() {
    return this.auth.user;
  }

  logout() {
    this.userService.setUser(undefined);
    return this.auth.signOut();
  }

  ngOnInit(): void {
    this.auth.user.subscribe((value) => {
      console.log(value);
    });
  }
}
