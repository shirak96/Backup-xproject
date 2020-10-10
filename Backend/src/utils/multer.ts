import * as multer from 'multer';

export const multerStorage = (upload_path: string = 'images') => {
    return multer.diskStorage({
        destination: './public/uploads/' + upload_path,
        filename: function (req, file, cb) {
            cb(null, Date.now() + '.' + file.originalname);
        }
    });
};
export const multerUpload = (upload_path: string, config: any = {}) => {
    const storage = multerStorage(upload_path);
    return multer({
        storage: storage,
        // limits: {fileSize: 1000000},
        ...config
    });

};
export const getFields = multer();
