import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { Comment, CommentUpdateRequest } from '../../../shared/models/comment.model';
import { Note } from '../../../shared/models/note.model';
import { User } from '../../../shared/models/user.model';
import { CommentService } from '../../../shared/services/comment.service';
import { getName } from '../../../shared/utils/name';
import { toDatePipe } from '../../pipes/to-date.pipe';

@Component({
  selector: 'jegyzi-note-comment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AvatarComponent, toDatePipe, MatInput, MatTooltip],
  templateUrl: './note-comment.component.html',
  styleUrl: './note-comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteCommentComponent {
  allComments = signal(false);

  private commentService = inject(CommentService);
  note = input.required<Note>();
  loggedInUser = input<User>();

  edit = signal(false);
  editCommentForm = new FormControl<string | null>(null);

  comments = computed(() => {
    if (this.allComments()) {
      return this.commentService.getCommentsbyNote(this.note().id);
    } else {
      return this.commentService.getCommentsbyNoteLimited(this.note().id);
    }
  });

  commentForm = new FormGroup({
    creatorId: new FormControl<string | null>(null),
    creatorProfilPic: new FormControl<boolean | null>(null),
    creatorName: new FormControl<string | null>(null),
    date: new FormControl<Timestamp>(Timestamp.fromDate(new Date()) as Timestamp),
    comment: new FormControl<string | null>(null),
    note: new FormControl<string | null>(null),
  });

  newComment = output<Comment | undefined>();

  submit() {
    this.commentForm.controls.creatorId.setValue(this.loggedInUser()!.id!);
    this.commentForm.controls.creatorProfilPic.setValue(this.loggedInUser()!.profilePicture!);
    this.commentForm.controls.creatorName.setValue(getName(this.loggedInUser()!));
    this.commentForm.controls.note.setValue(this.note().id);
    this.newComment.emit(this.commentForm.value as Comment);
    this.commentForm.reset();
  }

  loadMoreComment() {
    this.allComments.set(true);
  }
  loadLessComment() {
    this.allComments.set(false);
  }

  startEdit(comment: string) {
    this.editCommentForm.setValue(comment);
    this.edit.set(true);
  }

  editComment(commentId: string) {
    if (this.editCommentForm.value) {
      const updateValue: CommentUpdateRequest = {
        comment: this.editCommentForm.value,
        lastModified: Timestamp.fromDate(new Date()),
      };

      this.commentService.updateComment(commentId, updateValue).then(() => {
        this.edit.set(false);
        this.newComment.emit(undefined);
      });
    }
  }

  deleteComment(commentId: string) {
    this.commentService.deleteComment(commentId, this.note()).then(() => {
      this.newComment.emit(undefined);
    });
  }
}
