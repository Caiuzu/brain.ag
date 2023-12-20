import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Farm from './Farm'

export default class Farmer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public document: string

  @column()
  public farmId: number

  @belongsTo(() => Farm)
  public farm: BelongsTo<typeof Farm>
}
