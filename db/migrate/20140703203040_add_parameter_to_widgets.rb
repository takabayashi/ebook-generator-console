class AddParameterToWidgets < ActiveRecord::Migration
  def change
    add_column :widgets, :parameter, :string
  end
end
