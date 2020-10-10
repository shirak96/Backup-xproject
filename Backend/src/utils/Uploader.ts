import multer from 'multer';
import * as util from 'util';

import {multerStorage, multerUpload} from './multer'
import {NextFunction, Request, Response} from "express";

export default class Uploader {
    private upload;

    constructor(upload_path: string) {
        this.upload = multerUpload(upload_path);
    }

    async startUpload(req: Request, res: Response, next: NextFunction, field_name) {

        return new Promise<{
            fieldname: string,
            originalname: string, encoding: string,
            mimetype: string,
            destination: string,
            filename: string, path: string,
            size: number,

        }| any>((resolve, reject) => {
            const current_upload = this.upload.single(field_name);
            current_upload(req, res, function (err) {
                if (err) {
                    // An unknown error occurred when uploading.
                    reject(err.message)
                }
                // @ts-ignore
                resolve({...req.file, ...req.body});
                // Everything went fine.
            })
        })

    }
}
