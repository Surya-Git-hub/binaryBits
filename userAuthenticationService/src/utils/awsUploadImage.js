require("dotenv").config();

const {
    S3Client,
    PutObjectCommand
} = require("@aws-sdk/client-s3");

const s3Config = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_SECRET,
    region: process.env.AWS_REGION,
};
const s3Client = new S3Client(s3Config);
const awsUploadImage = async (file,fileName) => {
    const bucketParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: file.data,
    };

    try {
        const data = await s3Client.send(new PutObjectCommand(bucketParams));
        return data;
    } catch (err) {
        console.log("Error", err);
    }
}
module.exports = awsUploadImage; 
