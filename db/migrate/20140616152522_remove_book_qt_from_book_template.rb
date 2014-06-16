class RemoveBookQtFromBookTemplate < ActiveRecord::Migration
  def change
    remove_column :book_templates, :book_qt, :string
  end
end
