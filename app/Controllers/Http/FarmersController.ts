import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Logger from '@ioc:Adonis/Core/Logger';
import StoreFarmerValidator from 'App/Validators/StoreFarmerValidator';
import UpdateFarmerValidator from 'App/Validators/UpdateFarmerValidator';
import FarmerConverter from 'App/Converters/FarmerConverter';
import FarmerService from 'App/Services/FarmerService';

export default class FarmersController {
  private farmerService = new FarmerService();

  public async index({ response }: HttpContextContract) {
    try {
      const farmers = await this.farmerService.findAllFarmers();
      const formattedResponse = farmers.map(FarmerConverter.toResponse);

      Logger.info('Listing Farmer completed successfully');

      return response.ok(formattedResponse);
    } catch (e) {
      return response.notFound({ message: 'Error when listing Farmers.' });
    }
  }

  public async show({ params, response }: HttpContextContract) {
    try {
      const farmer = await this.farmerService.findFarmerById(params.id);
      return response.ok(FarmerConverter.toResponse(farmer));
    } catch (error) {
      return response.notFound({ message: 'Farmer not found.' });
    }
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const validatedData = await request.validate(StoreFarmerValidator);
      const farmer = await this.farmerService.createFarmer(validatedData);

      const farmFarmerFormatted = FarmerConverter.toResponse(farmer);
      Logger.info(`Farmer successfully created: ${farmer.id}`);
      return response.created(farmFarmerFormatted);
    } catch (error) {
      Logger.error(error)
      if (error.messages) {
        return response.badRequest({ message: 'An error occurred while validating Farmer.', error: error.messages });
      }
      return response.internalServerError({ message: 'An error occurred while creating Farmer.' });
    }
  }

  public async update({ params, request, response }: HttpContextContract) {
    try {

      const validatedData = await request.validate(UpdateFarmerValidator);

      const farmer = await this.farmerService.updateFarmer(params.id, validatedData);

      Logger.info(`Farmer successfully updated: ${farmer.id}`);
      return response.ok(FarmerConverter.toResponse(await this.farmerService.findFarmerById(farmer.id)));
    } catch (error) {
      Logger.error(error)
      if (error.messages) {
        return response.badRequest({ message: 'An error occurred while validating Farmer.', error: error.messages });
      }
      return response.notFound({ message: 'Farmer not found.' });
    }
  }

  public async destroy({ params, response }: HttpContextContract) {
    try {

      const farm = await this.farmerService.findFarmerById(params.id)
      await this.farmerService.deleteFarmer(farm);

      Logger.info(`Farmer successfully deleted: ${params.id}`);
      return response.ok({ message: 'Farmer successfully deleted.' });
    } catch (error) {
      Logger.error(`Error when deleting Farmer ${params.id}: `, error);
      return response.notFound({ message: 'Farmer not found or error deleting.' });
    }
  }

}
