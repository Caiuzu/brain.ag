import Farmer from 'App/Models/Farmer';

export default class FarmerConverter {
  public static toResponse(farmer: Farmer) {
    const farmerJson = farmer.toJSON();
    delete farmerJson.farm?.farmCrops;
    delete farmerJson.farm_id;
    return farmerJson;
  }
}