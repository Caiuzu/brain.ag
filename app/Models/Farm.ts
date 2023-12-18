import { BaseModel, HasMany, column, computed, hasMany } from '@ioc:Adonis/Lucid/Orm';
import FarmCrop from './FarmCrop';

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
  public totalArea: number;

  @column()
  public agriculturalArea: number;

  @column()
  public vegetationArea: number;

  @hasMany(() => FarmCrop)
  public farmCrops: HasMany<typeof FarmCrop>;

  @computed()
  public get crops() {
    return this.farmCrops.map((farmCrop) => {
      return {
        id: farmCrop.crop.id,
        name: farmCrop.crop.name
      };
    });
  }
}
