import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Farmer from 'App/Models/Farmer';
import Farm from 'App/Models/Farm';
import FarmCrop from 'App/Models/FarmCrop';

export default class extends BaseSeeder {
  public async run() {
    const farmFarmerData = [
      {
        "name": "João Silva",
        "document": "123.456.789-00",
        "farm": {
          "name": "Fazenda Boa Vista",
          "state": "Mato Grosso do Sul",
          "city": "Campo Grande",
          "total_area": 1000,
          "agricultural_area": 800,
          "vegetation_area": 200,
          "crops": [
            {
              "id": 3,
              "name": "Algodão"
            },
            {
              "id": 4,
              "name": "Café"
            }
          ]
        }
      },
      {
        "name": "Maria Souza",
        "document": "987.654.321-00",
        "farm": {
          "name": "Fazenda Belo Riacho",
          "state": "Mato Grosso",
          "city": "Cuiabá",
          "total_area": 1200,
          "agricultural_area": 920,
          "vegetation_area": 200,
          "crops": [
            {
              "id": 1,
              "name": "Soja"
            },
            {
              "id": 2,
              "name": "Milho"
            }
          ]
        }
      },
      {
        "name": "Carlos Pereira",
        "document": "222.333.444-55",
        "farm": {
          "name": "Fazenda Sol Nascente",
          "state": "São Paulo",
          "city": "Ribeirão Preto",
          "total_area": 850,
          "agricultural_area": 650,
          "vegetation_area": 200,
          "crops": [
            {
              "id": 1,
              "name": "Soja"
            },
            {
              "id": 5,
              "name": "Cana de Açúcar"
            }
          ]
        }
      },
      {
        "name": "Ana Martins",
        "document": "555.666.777-88",
        "farm": {
          "name": "Fazenda Vento Leste",
          "state": "Paraná",
          "city": "Londrina",
          "total_area": 950,
          "agricultural_area": 750,
          "vegetation_area": 200,
          "crops": [
            {
              "id": 2,
              "name": "Milho"
            },
            {
              "id": 3,
              "name": "Algodão"
            }
          ]
        }
      },
      {
        "name": "Luiz Alberto de Gonçalves",
        "document": "567.890.123-67",
        "farm": {
          "name": "Fazenda Lua Minguante",
          "state": "Rio Grande do Sul",
          "city": "Porto Alegre",
          "total_area": 1800,
          "agricultural_area": 1600,
          "vegetation_area": 1200,
          "crops": [
            {
              "id": 4,
              "name": "Café"
            },
            {
              "id": 5,
              "name": "Cana de Açúcar"
            }
          ]
        }
      },
      {
        "name": "Roberto Alencar",
        "document": "675.902.234-75",
        "farm": {
          "name": "Fazenda Terra Nova",
          "state": "Goiás",
          "city": "Goiânia",
          "total_area": 1500,
          "agricultural_area": 1200,
          "vegetation_area": 300,
          "crops": [
            {
              "id": 2,
              "name": "Milho"
            },
            {
              "id": 3,
              "name": "Algodão"
            },
            {
              "id": 1,
              "name": "Soja"
            }
          ]
        }
      },
      {
        "name": "Luísa Fernandes",
        "document": "567.450.321-99",
        "farm": {
          "name": "Fazenda Vale do Sol",
          "state": "Rio Grande do Sul",
          "city": "Pelotas",
          "total_area": 800,
          "agricultural_area": 600,
          "vegetation_area": 200,
          "crops": [
            {
              "id": 4,
              "name": "Café"
            },
            {
              "id": 5,
              "name": "Cana de Açúcar"
            }
          ]
        }
      },
      {
        "name": "Rogério Almeida",
        "document": "678.901.234-78",
        "farm": {
          "name": "Fazenda Nova Vida",
          "state": "Goiás",
          "city": "Goiânia",
          "total_area": 2000,
          "agricultural_area": 1700,
          "vegetation_area": 700,
          "crops": [
            {
              "id": 2,
              "name": "Milho"
            },
            {
              "id": 3,
              "name": "Algodão"
            }
          ]
        }
      },
      {
        "name": "Fernanda Machado",
        "document": "789.012.345-89",
        "farm": {
          "name": "Fazenda Estrela da Manhã",
          "state": "Maranhão",
          "city": "São Luís",
          "total_area": 950,
          "agricultural_area": 700,
          "vegetation_area": 250,
          "crops": [
            {
              "id": 1,
              "name": "Soja"
            },
            {
              "id": 5,
              "name": "Cana de Açúcar"
            }
          ]
        }
      },
      {
        "name": "Tiago Oliveira",
        "document": "890.123.456-90",
        "farm": {
          "name": "Fazenda Ouro Verde",
          "state": "Tocantins",
          "city": "Palmas",
          "total_area": 1100,
          "agricultural_area": 900,
          "vegetation_area": 200,
          "crops": [
            {
              "id": 3,
              "name": "Algodão"
            },
            {
              "id": 2,
              "name": "Milho"
            },
            {
              "id": 4,
              "name": "Café"
            }
          ]
        }
      }
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
