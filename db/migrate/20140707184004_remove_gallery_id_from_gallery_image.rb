class RemoveGalleryIdFromGalleryImage < ActiveRecord::Migration
  def change
    remove_reference :gallery_images, :gallery_id, index: true
  end
end
