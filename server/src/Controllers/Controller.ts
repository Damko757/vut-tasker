import mongoose, { type Model } from "mongoose";
import type { NextFunction, Request, Response } from "express";
import type { HttpMethod } from "../Entities/HttpMethod.ts";

export class Controller<modelT extends Model<any>> {
    constructor() {}

    static async update<T extends Model<any>>(
        model: T,
        filter: mongoose.RootFilterQuery<T> | undefined,
        update: mongoose.UpdateQuery<T>
    ): Promise<T | null | mongoose.Error.ValidationError> {
        const doc = await model.findOneAndUpdate(filter, update, {
            new: true,
            runValidators: true,
        });

        console.log(doc);

        return doc;
    }
    static async replace<T extends Model<any>>(
        model: T,
        filter: mongoose.RootFilterQuery<T> | undefined,
        update: mongoose.UpdateQuery<T>
    ): Promise<T | null | mongoose.Error.ValidationError> {
        const doc = await model.findOneAndReplace(filter, update, {
            new: true,
            runValidators: true,
        });

        console.log(doc);

        return doc;
    }
}
