import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Farm from './Farm'

export default class Crop extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @belongsTo(() => Farm)
  public farm: BelongsTo<typeof Farm>
}
