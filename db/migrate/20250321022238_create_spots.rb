class CreateSpots < ActiveRecord::Migration[7.2]
  def change
    create_table :spots do |t|
      t.string :address, null: false, default: ""
      t.float :latitude, null: false, default: 0
      t.float :longitude, null: false, default: 0

      t.timestamps
    end
  end
end
