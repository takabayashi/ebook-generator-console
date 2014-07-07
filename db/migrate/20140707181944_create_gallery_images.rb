class CreateGalleryImages < ActiveRecord::Migration
  def change
    create_table :gallery_images do |t|
      t.string :file_name
      t.references :gallery_id, index: true

      t.timestamps
    end
  end
end
