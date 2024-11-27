import { inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { Comment, CommentUpdateRequest } from '../models/comment.model';
import { Note } from '../models/note.model';
import { Notification, NotificationType } from '../models/notification.model';
import { NoteService } from './note.service';
import { NotificationService } from './notifictaion.service';

@Injectable({
  providedIn: 'root',
})
/** Kommenteket kezelő szolgáltatások */
export class CommentService {
  readonly collectionName = 'Comments';

  private store = inject(AngularFirestore);
  private notificationService = inject(NotificationService);
  private noteService = inject(NoteService);

  /**
   * Komment létrehozása
   * @param comment komment
   * @param note jegyzet
   */
  async createComment(comment: Comment, note: Note) {
    comment.id = this.store.createId();

    const data = await this.store
      .collection<Comment>(this.collectionName)
      .doc(comment.id)
      .set(comment)
      .then(() => {
        const noti: Notification = {
          id: '',
          user: note.creatorId,
          date: Timestamp.fromDate(new Date()),
          new: true,
          title: 'Új hozzászólás!',
          type: NotificationType.COMMENT,
          linkedEntityId: note.id,
          description: comment.creatorName + ' hozzászólt a(z) ' + note.title + ' című jegyzetedhez.',
        };
        this.notificationService.createNotification(noti);
        this.noteService.addComment(comment.id, note);
      });
    return data;
  }

  /**
   * Kommentek lekérése
   * @returns kommentek
   */
  async getComments() {
    const data = await this.store
      .collection<Comment>(this.collectionName)
      .ref.get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }

  /**
   * Jegyzethez érkezett kommentek lekérése
   * @param noteId jegyzet id-ja
   * @returns kommentek
   */
  async getCommentsbyNote(noteId: string) {
    const data = await this.store
      .collection<Comment>(this.collectionName)
      .ref.where('note', '==', noteId)
      .orderBy('date', 'desc')
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }

  /**
   * Jegyzethez érkezett kommentek lekérése (10db)
   * @param noteId jegyzet id-ja
   * @returns kommentek
   */
  async getCommentsbyNoteLimited(noteId: string) {
    const data = await this.store
      .collection<Comment>(this.collectionName)
      .ref.where('note', '==', noteId)
      .orderBy('date', 'desc')
      .limit(10)
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });
    return data;
  }

  /**
   * Felhasználó által írt kommentek lekérése
   * @param userId felhasználó id-ja
   * @returns kommentek
   */
  async getCommentsbyUser(userId: string) {
    const data = await this.store
      .collection<Comment>(this.collectionName)
      .ref.where('creatorId', '==', userId)
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }

  /**
   * Komment módosítása
   * @param commentId komment id-ja
   * @param commentUpdateRequest módosítások
   */
  async updateComment(commentId: string, commentUpdateRequest: CommentUpdateRequest) {
    const data = await this.store
      .collection<Comment>(this.collectionName)
      .doc(commentId)
      .update({ lastModified: commentUpdateRequest.lastModified, comment: commentUpdateRequest.comment });

    return data;
  }

  /**
   * Komment szerzőjének módosítása felhasználó törlése esetén
   * @param userId törölt felhasználó id-ja
   */
  async updateCommentCreator(userId: string) {
    const comments = await this.getCommentsbyUser(userId);

    if (comments) {
      comments.map((comment) =>
        this.store.collection<Comment>(this.collectionName).doc(comment.id).update({ creatorId: '0', creatorName: 'Törölt felhasználó' }),
      );
    }
  }

  /**
   * Komment törlése
   * @param commentId komment id-ja
   * @param note jegyzet
   */
  async deleteComment(commentId: string, note?: Note) {
    const data = await this.store
      .collection<Comment>(this.collectionName)
      .doc(commentId)
      .delete()
      .then(() => {
        if (note) {
          this.noteService.deleteComment(note, commentId);
        }
      });

    return data;
  }
}
