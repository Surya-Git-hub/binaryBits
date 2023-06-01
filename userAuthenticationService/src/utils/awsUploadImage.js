const AWS = require('aws-sdk');
const s3 = new AWS.S3();
require("dotenv").config();
// Function to upload the image to S3
module.exports.uploadImageToS3 = async (file) => {
    const params = {
        Bucket: 'your-bucket-name', // Replace with your S3 bucket name
        Key: `profile-images/${file.name}`, // Set the desired key or path in the S3 bucket
        Body: file.data, // The image file data
        ContentType: file.mimetype, // Set the appropriate content type for the image file
    };

    return s3.upload(params).promise();
};