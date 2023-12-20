import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Crop from 'App/Models/Crop'

export default class extends BaseSeeder {
  public async run() {
    await Crop.createMany([
      { id: 1, name: 'Soja' },
      { id: 2, name: 'Milho' },
      { id: 3, name: 'Algodão' },
      { id: 4, name: 'Café' },
      { id: 5, name: 'Cana de Açúcar' },
    ])
  }
}
