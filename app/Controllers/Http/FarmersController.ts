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
      return response.notFound({ message: 'Farmer não encontrado.' });
    }
  }

  public async store({ request, response }: HttpContextContract) {

    const payload = request.only(['name', 'document', 'farm']);
    const farmData = payload.farm;
    const cropIds = farmData.crops;
    delete farmData.crops;

    const farm = await Farm.create(farmData);

    const farmer = await Farmer.create({
      name: payload.name,
      document: payload.document,
      farmId: farm.id
    });

    await Promise.all(cropIds.map((cropId: number) => {
      return FarmCrop.create({
        farmId: farm.id,
        cropId
      });
    }));

    const farmFarmer = await this.findFarmerById(farmer.id);
    const farmFarmerFormatted = this.formatFarmerResponse(farmFarmer);

    return response.created(farmFarmerFormatted);
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

}
