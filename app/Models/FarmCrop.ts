import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Farm from './Farm'
import Crop from './Crop'

export default class FarmCrop extends BaseModel {
  @column()
  public id: number

  @column()
  public farmId: number

  @column()
  public cropId: number

  @belongsTo(() => Farm)
  public farm: BelongsTo<typeof Farm>

  @belongsTo(() => Crop)
  public crop: BelongsTo<typeof Crop>
}
