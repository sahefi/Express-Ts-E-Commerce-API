import { uploadMiddleware } from '@src/services/Common/uploadService'
import express, { Request, Response } from 'express'
import multer from 'multer'
import AWS from 'aws-sdk';
const router = express.Router()
const upload = multer({dest:'uploads/'})


router.post('/',async(req:Request,res:Response)=>{
    try {
        const upload = await uploadMiddleware(); // Panggil fungsi upload untuk mendapatkan middleware multer
        upload.single('image')(req, res, function (err) {
          if (err instanceof multer.MulterError) {
            // Handle Multer errors
            return res.status(500).json({ message: 'Multer error occurred', error: err });
          } else if (err) {
            // Handle other errors
            return res.status(500).json({ message: 'An error occurred', error: err });
          } else {
            // Jika file diunggah, req.file akan berisi informasi tentang file yang diunggah
            if (req.file) {
              const filePath = req.file.path; // Path tempat file disimpan setelah diunggah
              console.log('File uploaded successfully. Path:', filePath);
              return res.status(200).json({ message: 'File uploaded successfully', filePath });
            } else {
              return res.status(400).json({ message: 'Please upload a file' });
            }
          }
        });
      } catch (error) {
        // Handle errors during middleware initialization
        return res.status(500).json({ message: 'An error occurred', error: error.message });
      }
})

// router.post('v2/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('Tidak ada file yang diupload.');
//   }

//   const params = {
//     Bucket: process.env.AWS_S3_BUCKET_NAME||'',
//     Key: req.file.originalname, // Key di AWS S3 akan menggunakan nama file yang diupload
//     Body: req.file.buffer // Menggunakan buffer file dari multer
//   };

//   s3.upload(params, (err: AWS.AWSError, data: AWS.S3.ManagedUpload.SendData) => {
//     if (err) {
//       res.status(500).send(err.message); // Menampilkan pesan kesalahan
//     } else {
//       res.send('File berhasil diupload ke AWS S3!');
//     }
//   });

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION, // Replace with your S3 bucket's region
});

const s3 = new AWS.S3();
router.post('/v2', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // const fileStream = fs.createReadStream(req.file.path);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: req.file.originalname,
      Body: req.file.path,
    };
    const uploaded = await s3.upload(params).promise();
    return res.status(200).send({ success: true, message: 'File uploaded successfully', data: uploaded.Location });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).send({ success: false, message: 'Error uploading file', error });
  }
});

export default router