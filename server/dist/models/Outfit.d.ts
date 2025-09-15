import mongoose, { Document } from 'mongoose';
export interface IOutfit extends Document {
    name: string;
    description?: string;
    items: mongoose.Types.ObjectId[];
    occasion: string;
    season: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
    style: string[];
    tags: string[];
    isFavorite: boolean;
    rating?: number;
    notes?: string;
    lastWorn?: Date;
    wearCount: number;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Outfit: mongoose.Model<IOutfit, {}, {}, {}, mongoose.Document<unknown, {}, IOutfit, {}, {}> & IOutfit & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Outfit.d.ts.map