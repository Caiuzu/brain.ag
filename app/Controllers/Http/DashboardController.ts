import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Farm from 'App/Models/Farm';
import Database from '@ioc:Adonis/Lucid/Database';
import Crop from 'App/Models/Crop';

interface AggregationResult {
  total: number;
}

export default class DashboardController {
  public async getTotalFarmsAndArea({ response }: HttpContextContract) {
    const totalFarms = await Database.from('farms').count('* as total').first() as AggregationResult;
    const totalArea = await Database.from('farms').sum('total_area as total').first() as AggregationResult;

    return response.ok({ totalFarms: totalFarms.total, totalArea: totalArea.total });
  }

  public async getFarmsByState({ response }: HttpContextContract) {
    const queryResult = await Farm.query()
      .groupBy('state')
      .count('* as total')
      .select('state');

    const farmsByState = queryResult.map(row => ({
      state: row.state,
      total: row.$extras.total
    }));

    return response.ok(farmsByState);
  }

  public async getFarmsByCrop({ response }: HttpContextContract) {
    const farmsByCrop = await Crop.query()
      .leftJoin('farm_crops', 'crops.id', 'farm_crops.crop_id')
      .groupBy('crops.name')
      .count('* as total')
      .select('crops.name');

    const formattedResult = farmsByCrop.map(row => ({
      name: row.name,
      total: row.$extras.total
    }));

    return response.ok(formattedResult);
  }

  public async getLandUse({ response }: HttpContextContract) {
    const queryResult = await Farm.query()
      .select('state')
      .sum('agricultural_area as agricultural')
      .sum('vegetation_area as vegetation')
      .groupBy('state');

    const landUse = queryResult.map(row => ({
      state: row.state,
      agricultural: row.$extras.agricultural,
      vegetation: row.$extras.vegetation
    }));

    return response.ok(landUse);
  }

}
