import cloudinary from 'cloudinary';

// CLOUDINARY_CLOUD_NAME = dwouepph4
// CLOUDINARY_API_KEY = 945814147879561
// CLOUDINARY_API_SECRET = YJtSjnAwmuni7Rcw25wYiN3pMIs

cloudinary.v2.config({ 
    cloud_name: "dwouepph4", 
    api_key: "945814147879561", 
    api_secret: "YJtSjnAwmuni7Rcw25wYiN3pMIs"
});

export const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.v2.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        return response;

    } catch (error) { // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}