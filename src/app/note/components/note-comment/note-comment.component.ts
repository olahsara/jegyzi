import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { Comment, CommentUpdateRequest } from '../../../shared/models/comment.model';
import { Note } from '../../../shared/models/note.model';
import { User } from '../../../shared/models/user.model';
import { ElapsedTimePipe } from '../../../shared/pipes/elapsed-time.pipe';
import { CommentService } from '../../../shared/services/comment.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';
import { toDatePipe } from '../../pipes/to-date.pipe';

@Component({
  selector: 'jegyzi-note-comment',
  standalone: true,
  imports: [CommonModule, AvatarComponent, toDatePipe, FORM_DIRECTIVES, MatTooltip, ElapsedTimePipe],
  templateUrl: './note-comment.component.html',
  styleUrl: './note-comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteCommentComponent {
  allComments = signal(false);

  private commentService = inject(CommentService);
  note = input.required<Note>();
  loggedInUser = input<User>();

  edit = signal<string | undefined>(undefined);
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
    creatorName: new FormControl<string | null>(null),
    date: new FormControl<Timestamp | null>(null),
    comment: new FormControl<string | null>(null),
    note: new FormControl<string | null>(null),
  });

  refreshComment = output<Comment | undefined>();

  submit() {
    this.commentForm.controls.creatorId.setValue(this.loggedInUser()!.id!);
    this.commentForm.controls.creatorName.setValue(this.loggedInUser()!.name);
    this.commentForm.controls.note.setValue(this.note().id);
    this.commentForm.controls.date.setValue(Timestamp.fromDate(new Date()) as Timestamp);
    this.refreshComment.emit(this.commentForm.value as Comment);
    this.commentForm.reset();
  }

  loadMoreComment() {
    this.allComments.set(true);
  }
  loadLessComment() {
    this.allComments.set(false);
  }

  startEdit(comment: Comment) {
    this.editCommentForm.setValue(comment.comment);
    this.edit.set(comment.id);
  }

  editComment(commentId: string) {
    if (this.editCommentForm.value) {
      const updateValue: CommentUpdateRequest = {
        comment: this.editCommentForm.value,
        lastModified: Timestamp.fromDate(new Date()) as Timestamp,
      };

      this.commentService.updateComment(commentId, updateValue).then(() => {
        this.edit.set(undefined);
        this.refreshComment.emit(undefined);
      });
    }
  }

  deleteComment(commentId: string) {
    this.commentService.deleteComment(commentId, this.note()).then(() => {
      this.refreshComment.emit(undefined);
    });
  }
}
