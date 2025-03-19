class HomesController < ApplicationController
  def index
    # 緯度・経度取得
    @coordinate = Geocoder.search("東京駅").first.coordinates
  end
end
