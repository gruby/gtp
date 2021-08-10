class CreateItems < ActiveRecord::Migration[6.1]
  def change
    create_table :items do |t|
      t.string :title
      t.string :description
      t.string :duration
      t.datetime :web_added
      t.boolean :priority

      t.timestamps
    end
  end
end
