class Spot < ApplicationRecord
  # geocoderの設定(入力フォームのデータを保存したい場合は、下記はない方が良いかも)
  # geocoded_by :address
  reverse_geocoded_by :latitude, :longitude
  after_validation :geocode

  # バリデーション
  validates :address, presence: true
  validates :latitude, presence: true, numericality: { greater_than_equal_to: -90, less_than_or_equal_to: 90 }
  validates :longitude, presence: true, numericality: { greater_than_equal_to: -180, less_than_or_equal_to: 180 }

  # def address
  #   address.strip
  # end
end
