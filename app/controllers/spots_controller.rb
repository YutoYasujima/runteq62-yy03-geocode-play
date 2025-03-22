class SpotsController < ApplicationController
  def index
    @spots = Spot.all
    @spot = Spot.new
  end

  def create
    @spots = Spot.all
    spot = Spot.new(spot_params)
    if spot.save
      @spot = Spot.new
      redirect_to spots_path, notice: '登録に成功しました'
      # redirect_to spots_path
    else
      @spot = spot
      flash.now[:alert] = '登録に失敗しました'
      render :index, status: :unprocessable_entity
    end
  end

  def search
    latitude = params[:latitude]
    longitude = params[:longitude]
    address = Geocoder.search([latitude, longitude]).first.address
    # 500m圏内のデータ取得
    @spots = Spot.near([latitude, longitude], 0.5)
    @spot = Spot.new(address: address, latitude: latitude, longitude: longitude)
    # render :search
  end

  private

  def spot_params
    params.require(:spot).permit(:address, :latitude, :longitude)
  end
end
