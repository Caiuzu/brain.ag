import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Farm from 'App/Models/Farm';
import FarmCrop from 'App/Models/FarmCrop';
import Farmer from 'App/Models/Farmer';
import Logger from '@ioc:Adonis/Core/Logger';
import FarmerValidator from 'App/Validators/FarmerValidator';

export default class FarmersController {

  public async index({ response }: HttpContextContract) {
    try {
      const farmers = await this.preloadFarmers();
      const formattedResponse = farmers.map(farmer => this.formatFarmerResponse(farmer));

      Logger.info('Listing Farmer completed successfully');

      return response.ok(formattedResponse);
    } catch (e) {
      return response.notFound({ message: 'Error when listing Farmers.' });
    }
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

      const validatedData = await request.validate(FarmerValidator);

      const farm = await this.createFarm(validatedData.farm);
      const farmer = await this.createFarmer(validatedData, farm.id);

      await this.createOrUpdateFarmCrops(farm.id, validatedData.farm.crops);

      const farmFarmer = await this.findFarmerById(farmer.id);
      const farmFarmerFormatted = this.formatFarmerResponse(farmFarmer);

      Logger.info(`Farmer successfully created: ${farmer.id}`);
      return response.created(farmFarmerFormatted);
    } catch (e) {
      console.error(e);
      return response.internalServerError({ message: 'An error occurred while creating Farmer.' });
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {
      const farmer = await Farmer.findOrFail(params.id);

      const validatedData = await request.validate(FarmerValidator);

      await this.updateFarmerAndFarm(farmer, validatedData);

      Logger.info(`Farmer successfully updated: ${farmer.id}`);
      return response.ok(this.formatFarmerResponse(await this.findFarmerById(farmer.id)));
    } catch (e) {
      return response.notFound({ message: 'Farmer not found.' });
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {
      const farmer = await Farmer.findOrFail(params.id);

      if (farmer.farmId) {
        await FarmCrop.query().where('farmId', farmer.farmId).delete();
        await Farm.findOrFail(farmer.farmId).then((farm) => farm.delete());
      }

      await farmer.delete();

      Logger.info(`Farmer successfully deleted: ${params.id}`);
      return response.ok({ message: 'Farmer successfully deleted.' });
    } catch (e) {
      return response.notFound({ message: 'Farmer not found or error deleting.' });
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

  //TODO: passar para um converter
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

  private async updateFarmerAndFarm(farmer: Farmer, payload) {
    farmer.merge({ name: payload.name, document: payload.document });
    await farmer.save();

    if (payload.farm) {
      const farm = await Farm.findOrFail(farmer.farmId);
      const { crops, ...farmData } = payload.farm;
      farm.merge(farmData);
      await farm.save();

      if (crops) {
        await this.createOrUpdateFarmCrops(farmer.farmId, crops);
      }
    }
  }

}
