import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm';
import Crop from './Crop';

export default class Farm extends BaseModel {

  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public state: string;

  @column()
  public city: string;

  @column()
  public total_area: number;

  @column()
  public agricultural_area: number;

  @column()
  public vegetation_area: number;

  @hasMany(() => Crop)
  public crops: HasMany<typeof Crop>;
}
