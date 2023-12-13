import multer from "multer";
import path from "path";
import fs from "fs"
import { S3 } from "aws-sdk";
import s3 from "@src/Config/Aws-s3.config";

export async function uploadMiddleware() {
    const storage = await multer.diskStorage({
        destination: function (req, file, cb) {
            const uploadPath = path.join(__dirname, '../../../', 'image'); // Resolve the upload path
            cb(null, uploadPath); // Simpan file di folder 'uploads/'
        },
        filename: function (req, file, cb) {
            const modifiedName = Date.now() + '-' + file.originalname.replace(/\s+/g, '-');
            cb(null, modifiedName);
        }
    
    
      });    
      const upload = multer({ storage: storage });
      console.log(upload)
      return upload
}

export async function uploadFile(req: any, res: any, next: any) {
    try {
      const upload = await uploadMiddleware(); // Call the upload function to get the multer middleware
      upload.single('image')(req, res, function (err: any) {
        if (err instanceof multer.MulterError) {
          return res.status(500).json({ message: 'Multer error occurred', error: err });
        } else if (err) {
          return res.status(500).json({ message: 'An error occurred', error: err });
        } else {
          if (req.file) {
            const filePath = req.file.path;
            console.log('File uploaded successfully. Path:', filePath);
            // If needed, you can pass the filePath to the next middleware or handler
            req.body.image_link = filePath;
            next(); // Call the next middleware or handler
          } else {
            return res.status(400).json({ message: 'Please upload a file' });
          }
        }
      });
    } catch (error) {
      return res.status(500).json({ message: 'An error occurred', error: error.message });
    }
  }
  
  export async function DeleteFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath);
      console.log('File deleted successfully:', filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Error deleting the image file');
    }
  }




// async function uploadFileToS3(bucketName: string, awspath: string, keyName: string) {
//   const fileContent = await fs.readFileSync(awspath);

//   const params = {
//     Bucket: bucketName,
//     Key: keyName,
//     Body: fileContent,
//   };

//   try {
//     const data = await s3.upload(params).promise();
//     console.log('File uploaded successfully. S3 Location:', data.Location);
//   } catch (error) {
//     console.error('Error uploading file:', error);
//   }
// }

