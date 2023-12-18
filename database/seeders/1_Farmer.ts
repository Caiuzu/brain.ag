import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Farmer from 'App/Models/Farmer';
import Farm from 'App/Models/Farm';
import FarmCrop from 'App/Models/FarmCrop';

export default class extends BaseSeeder {
  public async run() {
    const farmFarmerData = [
      {
        name: 'João Silva',
        document: '123.456.789-00',
        farm: {
          name: 'Fazenda Boa Vista',
          state: 'Mato Grosso do Sul',
          city: 'Campo Grande',
          total_area: 1000,
          agricultural_area: 800,
          vegetation_area: 200,
          crops: [
            {
              id: 3,
              name: 'Algodão'
            },
            {
              "id": 4,
              name: 'Café'
            }
          ],
        },
      },
      {
        name: 'Maria Souza',
        document: '987.654.321-00',
        farm: {
          name: 'Fazenda Belo Riacho',
          state: 'Mato Grosso',
          city: 'Cuiabá',
          total_area: 1200,
          agricultural_area: 920,
          vegetation_area: 200,
          crops: [
            {
              id: 1,
              name: 'Soja'
            },
            {
              id: 2,
              name: 'Milho'
            }
          ],
        },
      },
    ];

    for (const data of farmFarmerData) {
      const { farm, ...farmerData } = data;
      const { crops, ...restFarmData } = farm;

      const createdFarm = await Farm.create(restFarmData);
      await Farmer.create({ ...farmerData, farmId: createdFarm.id });

      for (const crop of crops) {
        await FarmCrop.create({
          farmId: createdFarm.id,
          cropId: crop.id,
        });
      }
    }
  }
}
