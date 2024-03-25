export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: any,
) => {
  if (!file) {
    return callback(new Error('No file found!'), false);
  }

  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  console.log(file);
  callback(null, true);
};
