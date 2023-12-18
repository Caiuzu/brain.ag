import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Farm from 'App/Models/Farm';
import FarmCrop from 'App/Models/FarmCrop';
import Farmer from 'App/Models/Farmer';

export default class FarmersController {

  public async index({ response }: HttpContextContract) {
    const farmers = await this.preloadFarmers();
    const formattedResponse = farmers.map(farmer => this.formatFarmerResponse(farmer));
    return response.ok(formattedResponse);
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const farmer = await this.findFarmerById(params.id);
      return response.ok(this.formatFarmerResponse(farmer));
    } catch (e) {
      return response.notFound({ message: 'Farmer not found.' });
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const payload = request.only(['name', 'document', 'farm']);
      const farm = await this.createFarm(payload.farm);
      const farmer = await this.createFarmer(payload, farm.id);
      await this.createOrUpdateFarmCrops(farm.id, payload.farm.crops);
  
      const farmFarmer = await this.findFarmerById(farmer.id);
      const farmFarmerFormatted = this.formatFarmerResponse(farmFarmer);
  
      return response.created(farmFarmerFormatted);
    } catch (e) {
      console.error(e);
      return response.internalServerError({ message: 'An error occurred while creating Farmer.' });
    }
  }

  private async preloadFarmers() {
    return Farmer.query()
      .preload('farm', (farmQuery) => {
        farmQuery.preload('farmCrops', (farmCropQuery) => {
          farmCropQuery.preload('crop');
        });
      })
      .exec();
  }

  private formatFarmerResponse(farmer: Farmer) {
    const farmerJson = farmer.toJSON();
    delete farmerJson.farm?.farmCrops;
    return farmerJson;
  }

  private async findFarmerById(id: number) {
    return Farmer.query()
      .where('id', id)
      .preload('farm', farmQuery =>
        farmQuery.preload('farmCrops', farmCropQuery =>
          farmCropQuery.preload('crop')))
      .firstOrFail();
  }

  private async createFarm(farmData): Promise<Farm> {
    const { crops, ...data } = farmData;
    return Farm.create(data);
  }

  private async createFarmer(farmerData, farmId): Promise<Farmer> {
    return Farmer.create({ ...farmerData, farmId });
  }

  private async createOrUpdateFarmCrops(farmId: number, cropIds: number[]) {
    await FarmCrop.query().where('farmId', farmId).delete();
    return Promise.all(cropIds.map(cropId => FarmCrop.create({ farmId, cropId })));
  }

}
