import { uploadMiddleware } from '@src/services/Common/uploadService'
import express, { Request, Response } from 'express'
import multer from 'multer'
const router = express.Router()
const upload = multer()


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


export default router