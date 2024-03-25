import { v4 as uuidv4 } from 'uuid';

export const fileNamer = (
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

  const fileExtension = file.mimetype.split('/')[1];
  const fileName = `${uuidv4()}.${fileExtension}`;

  //   console.log(fileName);
  callback(null, fileName);
};
