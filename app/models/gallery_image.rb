class GalleryImage < ActiveRecord::Base
  mount_uploader :file_name, GalleryImageUploader
end

