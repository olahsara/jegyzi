import { Injectable, Optional, Inject } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { LOCAL_STORAGE } from "@ng-web-apis/common";
import { Observable, map } from "rxjs";
import { User } from "../models/user.model";
import { AngularFirestore, DocumentData } from "@angular/fire/compat/firestore";
import { CollectionReference } from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root'
  })
  export class UserService {
    readonly collectionName = 'Users'
  
    constructor(private auth: AngularFireAuth, private store: AngularFirestore,  @Optional() @Inject(LOCAL_STORAGE) private storage?: Storage,) { }
  
    getUsers() {
        return this.store.collection<User>(this.collectionName).ref.orderBy('followersNumber', 'desc').get()
    }
  
  
  }