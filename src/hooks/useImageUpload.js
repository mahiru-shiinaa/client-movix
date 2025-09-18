import { useState } from 'react';
import { uploadToCloudinary } from '../helpers/uploadImage';

/**
 * Custom hook để xử lý upload và preview image
 * @param {Object} options - Cấu hình cho hook
 * @param {string} options.defaultImage - URL ảnh mặc định
 * @param {number} options.maxCount - Số lượng file tối đa (mặc định: 1)
 * @param {Function} options.onUploadSuccess - Callback khi upload thành công
 * @param {Function} options.onUploadError - Callback khi upload thất bại
 * @returns {Object} - Object chứa states và methods
 */
const useImageUpload = (options = {}) => {
  const {
    defaultImage = "https://i.pinimg.com/736x/0b/0a/de/0b0adeec0cb5e9a427a616df27ba04f3.jpg",
    maxCount = 1,
    onUploadSuccess = null,
    onUploadError = null
  } = options;

  // States
  const [fileToUpload, setFileToUpload] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [hasUserInteraction, setHasUserInteraction] = useState(false);

  // Helper function để convert file sang base64
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Xử lý trước khi upload (chỉ lưu file, chưa upload)
  const beforeUpload = (file) => {
    setFileToUpload(file);
    setHasUserInteraction(true);
    return false; // Ngăn auto upload
  };

  // Xử lý preview ảnh
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Xử lý thay đổi fileList
  const handleChange = (info) => {
    setHasUserInteraction(true);
    setFileList(info.fileList);

    // Nếu fileList rỗng (đã xóa ảnh)
    if (info.fileList.length === 0) {
      setFileToUpload("");
      setPreviewImage("");
    }
    
    // Nếu có file mới được thêm vào
    if (info.fileList.length > 0 && info.file?.originFileObj) {
      setFileToUpload(info.file.originFileObj);
    }
  };

  // Upload ảnh lên Cloudinary
  const uploadImage = async () => {
    if (!fileToUpload) return null;

    try {
      setUploading(true);
      
      if (fileToUpload === "") {
        // Ảnh đã bị xóa
        onUploadSuccess && onUploadSuccess(defaultImage);
        return defaultImage;
      }

      // Upload ảnh mới
      const url = await uploadToCloudinary(fileToUpload);
      onUploadSuccess && onUploadSuccess(url);
      return url;
      
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError && onUploadError(error);
      return defaultImage;
    } finally {
      setUploading(false);
    }
  };

  // Set initial values (dùng khi edit) - chỉ set nếu user chưa có tương tác
  const setInitialImage = (imageUrl) => {
    if (imageUrl && !hasUserInteraction) {
      setPreviewImage(imageUrl);
      const initialFileList = [
        {
          uid: "-1",
          name: "image.jpg",
          status: "done",
          url: imageUrl,
          thumbUrl: imageUrl,
        },
      ];
      setFileList(initialFileList);
    }
  };

  // Force set image (bỏ qua user interaction check)
  const forceSetImage = (imageUrl) => {
    if (imageUrl) {
      setPreviewImage(imageUrl);
      const initialFileList = [
        {
          uid: "-1",
          name: "image.jpg",
          status: "done",
          url: imageUrl,
          thumbUrl: imageUrl,
        },
      ];
      setFileList(initialFileList);
      setHasUserInteraction(false); // Reset interaction flag
    }
  };

  // Clear current image
  const clearImage = () => {
    setFileToUpload("");
    setPreviewImage("");
    setFileList([]);
    setPreviewOpen(false);
    setHasUserInteraction(true);
  };

  // Reset tất cả states về trạng thái ban đầu
  const resetAll = () => {
    setFileToUpload(null);
    setPreviewImage("");
    setFileList([]);
    setPreviewOpen(false);
    setUploading(false);
    setHasUserInteraction(false);
  };

  // Lấy URL cuối cùng để submit form
  const getFinalImageUrl = async (currentImageUrl = null) => {
    // Có file mới để upload
    if (fileToUpload && fileToUpload !== "") {
      return await uploadImage();
    }
    
    // Ảnh đã bị xóa
    if (fileToUpload === "") {
      return defaultImage;
    }
    
    // Giữ nguyên ảnh cũ nếu không có thay đổi
    if (currentImageUrl && fileToUpload === null) {
      return currentImageUrl;
    }
    
    // Trường hợp không có ảnh
    return defaultImage;
  };

  return {
    // States
    fileList,
    previewOpen,
    previewImage,
    uploading,
    hasUserInteraction,
    
    // Handlers cho Antd Upload component
    beforeUpload,
    handlePreview,
    handleChange,
    
    // Preview controls
    setPreviewOpen,
    
    // Utility methods
    uploadImage,
    setInitialImage,
    forceSetImage,
    clearImage,
    resetAll,
    getFinalImageUrl,
    
    // Upload props cho Antd Upload
    uploadProps: {
      maxCount,
      fileList,
      onPreview: handlePreview,
      onChange: handleChange,
      beforeUpload,
      listType: "picture-card",
    }
  };
};

export default useImageUpload;