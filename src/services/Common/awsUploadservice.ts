


// import { Request, Response, NextFunction } from 'express';
// import AWS from 'aws-sdk';
// import multer from 'multer';
// import fs from 'fs';

// // Configure AWS SDK
// AWS.config.update({
//   accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
//   secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
//   region: process.env.AWS_S3_REGION!,
// });

// // Create an S3 instance
// const s3 = new AWS.S3();
// const upload = multer({ dest: 'uploads/' });

// const s3UploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
//   upload.single('image')(req, res, async (err: any) => {
//     try {
//       if (err instanceof multer.MulterError) {
//         return res.status(400).send('Multer error: ' + err.message);
//       } else if (err) {
//         return res.status(500).send('Error uploading file: ' + err.message);
//       }

//       if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//       }


//       const params = {
//         Bucket: process.env.AWS_S3_BUCKET_NAME!,
//         Key: req.file.originalname,
//         Body: req.file.path,
//       };

//       const uploaded = await s3.upload(params).promise();
//       req.body.image_link = uploaded.Location; // Save the uploaded file URL to the request object
//       next(); // Move to the next middleware or route handler
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       return res.status(500).send('Error uploading file: ' + error.message);
//     }
//   });
// };

// export default s3UploadMiddleware;
