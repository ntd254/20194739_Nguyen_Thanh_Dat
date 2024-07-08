import { StripeAccount } from '@prisma/client';

export class StripeAccountEntity implements StripeAccount {
  id: string;
  userId: string;
  accountId: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}
