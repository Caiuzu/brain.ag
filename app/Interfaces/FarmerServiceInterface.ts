import Farmer from 'App/Models/Farmer'
import { FarmerData } from './FarmerData'

export default interface FarmerServiceInterface {
  createFarmer(data: FarmerData): Promise<Farmer>
  updateFarmer(farmerId: number, data: FarmerData): Promise<Farmer>
  deleteFarmer(farmer: Farmer): Promise<void>
  findAllFarmers(): Promise<Farmer[]>
  findFarmerById(id: number): Promise<Farmer>
}
