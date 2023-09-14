import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent {
  @Input() maxRating: number = 5;
  @Input() currentRating: number = 0;
  @Output() ratingClicked: EventEmitter<number> = new EventEmitter<number>();

  stars: { filled: boolean; value: number }[] = [];

  constructor() {
    for (let i = 1; i <= this.maxRating; i++) {
      this.stars.push({
        filled: i <= this.currentRating,
        value: i
      });
    }
  }

  rate(rating: number) {
    this.currentRating = rating;
    this.ratingClicked.emit(rating);
  }
}
