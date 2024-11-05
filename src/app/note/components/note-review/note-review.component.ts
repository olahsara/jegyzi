import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatInput } from '@angular/material/input';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating-component/rating.component';
import { Note } from '../../../shared/models/note.model';
import { Review } from '../../../shared/models/review.model';
import { User } from '../../../shared/models/user.model';
import { ReviewService } from '../../../shared/services/review.service';
import { getName } from '../../../shared/utils/name';
import { toDatePipe } from '../../pipes/to-date.pipe';

@Component({
  selector: 'jegyzi-note-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AvatarComponent,
    toDatePipe,
    MatExpansionModule,
    MatCheckboxModule,
    RatingComponent,
    MatInput,
  ],
  templateUrl: './note-review.component.html',
  styleUrl: './note-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteReviewComponent {
  private reviewService = inject(ReviewService);

  note = input.required<Note>();
  loggedInUser = input<User>();

  allReviews = signal(false);

  reviews = computed(() => {
    if (this.allReviews()) {
      return this.reviewService.getReviewsbyNote(this.note().id);
    } else {
      return this.reviewService.getReviewsbyNoteLimited(this.note().id);
    }
  });

  reviewForm = new FormGroup({
    anonim: new FormControl<boolean | null>(null),
    userId: new FormControl<string | null>(null),
    userProfilPic: new FormControl<boolean | null>(null),
    userName: new FormControl<string | null>(null),
    submitDate: new FormControl<Timestamp>(Timestamp.fromDate(new Date()) as Timestamp),
    stars: new FormControl<number | null>(null),
    description: new FormControl<string | null>(null),
    notesId: new FormControl<string | null>(null),
    avarageStar: new FormControl<number | null>(null),
  });

  newReview = output<Review>();

  selectStar(rating: number) {
    this.reviewForm.controls.stars.setValue(rating);
  }

  submit(panel: MatExpansionPanel) {
    if (!this.reviewForm.value.anonim) {
      this.reviewForm.controls.userId.setValue(this.loggedInUser()!.id!);
      this.reviewForm.controls.userProfilPic.setValue(this.loggedInUser()!.profilePicture!);
      this.reviewForm.controls.userName.setValue(getName(this.loggedInUser()!));
    }
    this.reviewForm.controls.notesId.setValue(this.note().id);
    this.newReview.emit(this.reviewForm.value as Review);
    this.reviewForm.reset();
    panel.close();
  }

  loadMoreReview() {
    this.allReviews.set(true);
  }
  loadLessReview() {
    this.allReviews.set(false);
  }
}
