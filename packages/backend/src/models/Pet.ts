import { Collection, ObjectId } from 'mongodb';
import { getDB } from '../database/mongodb';
import { PetProfile } from '@petsuite/shared/types/pet';

export interface PetDocument extends Omit<PetProfile, '_id'> {
  _id?: ObjectId;
  owner: string; // wallet address
  createdAt: Date;
  updatedAt: Date;
}

export class PetModel {
  private collection: Collection<PetDocument>;

  constructor() {
    this.collection = getDB().collection<PetDocument>('pets');
  }

  async create(petData: Omit<PetDocument, '_id' | 'createdAt' | 'updatedAt'>): Promise<PetDocument> {
    const now = new Date();
    const pet: PetDocument = {
      ...petData,
      createdAt: now,
      updatedAt: now,
    };

    const result = await this.collection.insertOne(pet as any);
    return { ...pet, _id: result.insertedId };
  }

  async findById(id: string): Promise<PetDocument | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async findByOwner(owner: string): Promise<PetDocument[]> {
    return await this.collection.find({ owner }).toArray();
  }

  async update(id: string, updates: Partial<PetDocument>): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async ensureIndexes(): Promise<void> {
    await this.collection.createIndex({ owner: 1 });
    await this.collection.createIndex({ species: 1 });
    await this.collection.createIndex({ createdAt: -1 });
  }
}
