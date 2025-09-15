import mongoose, { Document } from 'mongoose';
export interface IClothing extends Document {
    name: string;
    type: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessories';
    category: string;
    color: string;
    season: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
    style: string[];
    brand?: string;
    size?: string;
    material?: string;
    imageUrl: string;
    imagePath: string;
    tags: string[];
    isFavorite: boolean;
    lastWorn?: Date;
    wearCount: number;
    user: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Clothing: mongoose.Model<IClothing, {}, {}, {}, mongoose.Document<unknown, {}, IClothing, {}, {}> & IClothing & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Clothing.d.ts.map