import mongoose, { type Model } from "mongoose";

export class Controller<modelT extends Model<any>> {
  constructor() {}

  async update<T extends modelT>(
    model: T,
    filter: mongoose.FilterQuery<T> | undefined,
    update: mongoose.UpdateQuery<T>,
  ): Promise<T | null | mongoose.Error.ValidationError> {
    const doc = await model.findOneAndUpdate(filter, update, {
      new: true,
      runValidators: true,
    });

    return doc;
  }
  async replace<T extends modelT>(
    model: T,
    filter: mongoose.FilterQuery<T> | undefined,
    update: mongoose.UpdateQuery<T>,
  ): Promise<T | null | mongoose.Error.ValidationError> {
    const doc = await model.findOneAndReplace(filter, update, {
      new: true,
      runValidators: true,
    });

    return doc;
  }
  async delete<T extends modelT>(
    model: T,
    filter: mongoose.FilterQuery<T> | undefined,
  ): Promise<T | null | mongoose.Error.ValidationError> {
    const doc = await model
      .findOneAndDelete(filter, {
        new: true,
        runValidators: true,
      })
      .exec();

    return doc;
  }
}
