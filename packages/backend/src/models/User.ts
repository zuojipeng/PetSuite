import { ObjectId } from 'mongodb';

export type UserRole = 'user' | 'merchant' | 'admin';

export interface User {
  _id?: ObjectId;
  walletAddress: string;
  displayName?: string;
  email?: string;
  avatar?: string;
  roles: UserRole[];
  merchantProfile?: {
    storeName: string;
    description?: string;
    logo?: string;
    verified: boolean;
    applicationStatus: 'pending' | 'approved' | 'rejected';
    applicationDate?: Date;
    approvalDate?: Date;
  };
  preferences?: {
    language: 'zh' | 'en';
    currency: 'ETH' | 'USD';
    notifications: boolean;
  };
  stats?: {
    petsCount: number;
    ordersCount: number;
    nftsCount: number;
  };
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface CreateUserInput {
  walletAddress: string;
  displayName?: string;
  email?: string;
}

export interface UpdateUserInput {
  displayName?: string;
  email?: string;
  avatar?: string;
  preferences?: Partial<User['preferences']>;
}

export interface ApplyMerchantInput {
  walletAddress: string;
  storeName: string;
  description?: string;
  logo?: string;
}
