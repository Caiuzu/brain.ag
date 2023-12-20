import Farm from 'App/Models/Farm'
import Farmer from 'App/Models/Farmer'
import FarmCrop from 'App/Models/FarmCrop'
import { FarmerData } from 'App/Interfaces/FarmerData'
import FarmerServiceInterface from 'App/Interfaces/FarmerServiceInterface'

export default class FarmerService implements FarmerServiceInterface {
  public async createFarmer(data: FarmerData): Promise<Farmer> {
    const farm = await this.createFarm(data.farm)
    const farmer = await this.createFarmerData(data, farm.id)

    await this.createOrUpdateFarmCrops(farm.id, data.farm.crops)

    const farmFarmer = await this.findFarmerById(farmer.id)

    return farmFarmer
  }

  public async updateFarmer(farmerId: number, data: FarmerData): Promise<Farmer> {
    const farmer = await Farmer.findOrFail(farmerId)

    farmer.merge({ name: data.name, document: data.document })
    await farmer.save()

    if (data.farm) {
      const { crops, ...farmData } = data.farm
      let farm = await Farm.find(farmer.farmId)

      if (!farm) {
        farm = new Farm()
        const { name, state, city, totalArea, agriculturalArea, vegetationArea } = farmData
        Object.assign(farm, { name, state, city, totalArea, agriculturalArea, vegetationArea })

        await farmer.related('farm').associate(farm)
      } else {
        farm.merge(farmData)
        await farm.save()
      }

      await this.createOrUpdateFarmCrops(farmer.farmId, crops)
    }

    await farmer.load('farm', (farmQuery) => {
      farmQuery.preload('farmCrops', (farmCropQuery) => {
        farmCropQuery.preload('crop')
      })
    })

    return farmer
  }

  public async deleteFarmer(farmer: Farmer): Promise<void> {
    if (farmer.farmId) {
      await FarmCrop.query().where('farmId', farmer.farmId).delete()
      await Farm.findOrFail(farmer.farmId).then((farm) => farm.delete())
    }

    await farmer.delete()
  }

  public async findAllFarmers(): Promise<Farmer[]> {
    return Farmer.query()
      .preload('farm', (farmQuery) => {
        farmQuery.preload('farmCrops', (farmCropQuery) => {
          farmCropQuery.preload('crop')
        })
      })
      .exec()
  }

  public async findFarmerById(id: number): Promise<Farmer> {
    return Farmer.query()
      .where('id', id)
      .preload('farm', (farmQuery) =>
        farmQuery.preload('farmCrops', (farmCropQuery) => farmCropQuery.preload('crop'))
      )
      .firstOrFail()
  }

  private async createOrUpdateFarmCrops(farmId: number, cropIds: number[]) {
    await FarmCrop.query().where('farmId', farmId).delete()
    return Promise.all(cropIds.map((cropId: number) => FarmCrop.create({ farmId, cropId })))
  }

  private async createFarm(farmData): Promise<Farm> {
    const { crops, ...data } = farmData
    return Farm.create(data)
  }

  private async createFarmerData(farmerData, farmId): Promise<Farmer> {
    return Farmer.create({ ...farmerData, farmId })
  }
}
