class AddWebIdToItems < ActiveRecord::Migration[6.1]
  def change
    add_column :items, :web_id, :string
  end
end
