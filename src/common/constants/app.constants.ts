/** Default revenue split when a coupon is applied (percent of gross sale). */
export const DEFAULT_COUPON_OWNER_PCT = 70;
export const DEFAULT_PLATFORM_PCT = 20;
export const DEFAULT_DIRECT_PARENT_PCT = 10;

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum AffiliateRank {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum WithdrawalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum WalletTransactionType {
  COURSE_PURCHASE_DEBIT = 'course_purchase_debit',
  AFFILIATE_COMMISSION_ACTIVE = 'affiliate_commission_active',
  AFFILIATE_COMMISSION_PASSIVE = 'affiliate_commission_passive',
  PLATFORM_FEE = 'platform_fee',
  REFUND = 'refund',
  WITHDRAWAL_PENDING = 'withdrawal_pending',
  WITHDRAWAL_COMPLETED = 'withdrawal_completed',
  WITHDRAWAL_REJECTED = 'withdrawal_rejected',
  ADJUSTMENT = 'adjustment',
}

export enum NotificationType {
  NEW_REFERRAL = 'new_referral',
  NEW_SALE = 'new_sale',
  WITHDRAWAL_APPROVED = 'withdrawal_approved',
  COURSE_PURCHASED = 'course_purchased',
  COUPON_USED = 'coupon_used',
  SYSTEM = 'system',
}
