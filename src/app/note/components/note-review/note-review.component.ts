import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { MatExpansionModule, MatExpansionPanel } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvatarComponent } from '../../../shared/components/avatar/avatar/avatar.component';
import { RatingComponent } from '../../../shared/components/rating-component/rating.component';
import { Note } from '../../../shared/models/note.model';
import { Review } from '../../../shared/models/review.model';
import { User } from '../../../shared/models/user.model';
import { ElapsedTimePipe } from '../../../shared/pipes/elapsed-time.pipe';
import { toDatePipe } from '../../../shared/pipes/to-date.pipe';
import { ReviewService } from '../../../shared/services/review.service';
import { FORM_DIRECTIVES } from '../../../shared/utils/form';

@Component({
  selector: 'jegyzi-note-review',
  standalone: true,
  imports: [
    CommonModule,
    AvatarComponent,
    toDatePipe,
    MatExpansionModule,
    FORM_DIRECTIVES,
    RatingComponent,
    ElapsedTimePipe,
    MatTooltipModule,
  ],
  templateUrl: './note-review.component.html',
  styleUrl: './note-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteReviewComponent {
  private reviewService = inject(ReviewService);

  /** A jegyzet, aminek az értékeléseit kezeljük */
  note = input.required<Note>();
  /** Bejelentkezett felhasználó */
  loggedInUser = input<User>();

  /** Összes értékelést listázzuk-e */
  allReviews = signal(false);

  /** Értékelések lekérése az allReviews() értékének alapján */
  reviews = computed(() => {
    if (this.allReviews()) {
      return this.reviewService.getReviewsbyNote(this.note().id);
    } else {
      return this.reviewService.getReviewsbyNoteLimited(this.note().id);
    }
  });

  /** Új értékeléshez szükséges űrlap */
  reviewForm = new FormGroup({
    anonim: new FormControl<boolean | null>(null),
    userId: new FormControl<string | null>(null),
    userName: new FormControl<string | null>(null),
    submitDate: new FormControl<Timestamp>(Timestamp.fromDate(new Date()) as Timestamp),
    stars: new FormControl<number | null>(null),
    description: new FormControl<string | null>(null),
    notesId: new FormControl<string | null>(null),
    avarageStar: new FormControl<number | null>(null),
  });

  /**
   *  Értékelések módosításárt felelős esemény, értékelést vagy undefined-ot emittál
   */
  refreshReview = output<Review | undefined>();

  /**
   * Értékelés beállítésa
   * @param rating értékelés nagysága
   */
  selectStar(rating: number) {
    this.reviewForm.controls.stars.setValue(rating);
  }

  /**
   * Új értékelés hozzáadásást beállítő és eseményt emittelő metódus
   * @param panel az értékelést megadó mat-accordion panel
   */
  submit(panel: MatExpansionPanel) {
    this.reviewForm.controls.userId.setValue(this.loggedInUser()!.id!);
    if (!this.reviewForm.value.anonim) {
      this.reviewForm.controls.userName.setValue(this.loggedInUser()!.name);
    }
    this.reviewForm.controls.notesId.setValue(this.note().id);
    this.refreshReview.emit(this.reviewForm.value as Review);
    this.reviewForm.reset();
    panel.close();
  }

  /** Összes értékelés betöltése */
  loadMoreReview() {
    this.allReviews.set(true);
  }
  /** Kevesebb értéklés betöltése  */
  loadLessReview() {
    this.allReviews.set(false);
  }

  /**
   * Értékelés törlése
   * @param id az értékelés id-ja
   */
  deleteReview(id: string) {
    this.reviewService.deleteReview(id, this.note()).then(() => {
      this.refreshReview.emit(undefined);
    });
  }
}
