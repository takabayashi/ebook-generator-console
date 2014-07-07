class GalleryImagesController < ApplicationController
	def create
    @gallery_image = GalleryImage.new(file_name: params[:file])
    if @gallery_image.save!
	  respond_to do |format|
	    format.json{ render :json => @gallery_image }
	  end
    end
  end
end
