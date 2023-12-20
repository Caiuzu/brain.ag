import { FarmData } from './FarmData'

export interface FarmerData {
  id?: number
  name: string
  document: string
  farm_id?: number
  farm: FarmData
}
