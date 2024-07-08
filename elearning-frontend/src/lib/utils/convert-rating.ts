import { Rating } from '@/client-sdk';

export function convertRating(rating: Rating) {
  let rateNumber: number;
  switch (rating) {
    case Rating.ONE:
      rateNumber = 1;
      break;
    case Rating.TWO:
      rateNumber = 2;
      break;
    case Rating.THREE:
      rateNumber = 3;
      break;
    case Rating.FOUR:
      rateNumber = 4;
      break;
    case Rating.FIVE:
      rateNumber = 5;
      break;
  }

  return rateNumber;
}
