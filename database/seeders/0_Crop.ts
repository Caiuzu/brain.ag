import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Crop from 'App/Models/Crop';

export default class extends BaseSeeder {
  public async run() {
    await Crop.createMany([
      { name: 'Soja' },
      { name: 'Milho' },
      { name: 'Algodão' },
      { name: 'Café' },
      { name: 'Cana de Açúcar' },
    ]);
  }
}
