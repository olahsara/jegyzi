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
export class CommentService {
  readonly collectionName = 'Comments';

  private store = inject(AngularFirestore);
  private notificationService = inject(NotificationService);
  private noteService = inject(NoteService);

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
          description: comment.creatorName + ' hozzászólt a(z) ' + note.title + ' című jegyzetedet.',
        };
        this.notificationService.createNotification(noti);
        this.noteService.addComment(comment.id, note);
      });
    return data;
  }

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

  async getCommentById(id: string): Promise<Comment[]> {
    const data = await this.store
      .collection<Comment>(this.collectionName)
      .ref.where('id', '==', id)
      .limit(1)
      .get()
      .then((data) => {
        return data.docs.map((e) => {
          return e.data();
        });
      });

    return data;
  }

  async updateComment(commentId: string, commentUpdateRequest: CommentUpdateRequest) {
    const data = await this.store
      .collection<Comment>(this.collectionName)
      .doc(commentId)
      .update({ lastModified: commentUpdateRequest.lastModified, comment: commentUpdateRequest.comment });

    return data;
  }

  async deleteComment(commentId: string, note: Note) {
    const data = await this.store
      .collection<Comment>(this.collectionName)
      .doc(commentId)
      .delete()
      .then(() => {
        this.noteService.deleteComment(note, commentId);
      });

    return data;
  }
}
