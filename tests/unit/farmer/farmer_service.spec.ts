import Database from '@ioc:Adonis/Lucid/Database';
import { test } from '@japa/runner';
import Farm from 'App/Models/Farm';
import Farmer from 'App/Models/Farmer';
import FarmerService from 'App/Services/FarmerService';

test.group('FarmerService', (group) => {

  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('should create a farmer with farm and crops', async ({ assert }) => {
    const farmerService = new FarmerService();

    const data = {
      name: 'John Doe',
      document: '123.456.789-02',
      farm: {
        name: 'Green Farm',
        state: 'Some State',
        city: 'Some City',
        totalArea: 1000,
        agriculturalArea: 800,
        vegetationArea: 200,
        crops: [1]
      }
    };

    const farmer = await farmerService.createFarmer(data);

    assert.strictEqual(farmer instanceof Farmer, true);
    assert.strictEqual(farmer.name, data.name);
    assert.strictEqual(farmer.farm instanceof Farm, true);
    assert.strictEqual(farmer.farm.name, data.farm.name);
    assert.strictEqual(farmer.farm.crops.length, data.farm.crops.length);
  });

  test('should update a farmer and associated farm', async ({ assert }) => {
    const farmerService = new FarmerService();

    const existingFarmerId = 10;
    const updateData = {
      name: 'Jane Smith',
      document: '987.654.321-55',
      farm: {
        name: 'Blue Farm',
        state: 'Another State',
        city: 'Another City',
        totalArea: 1500,
        agriculturalArea: 1000,
        vegetationArea: 500,
        crops: [2]
      }
    };

    const updatedFarmer = await farmerService.updateFarmer(existingFarmerId, updateData);

    assert.equal(updatedFarmer.name, updateData.name);
    assert.equal(updatedFarmer.farm.name, updateData.farm.name);
  });

  test('should return all farmers', async (assert) => {
    const farmerService = new FarmerService();

    const farmers = await farmerService.findAllFarmers();

    assert.assert.isArray(farmers);
    farmers.forEach(farmer => assert.assert.instanceOf(farmer, Farmer));
  });

  test('should delete a farmer and associated farm', async ({ assert }) => {
    const farmerService = new FarmerService();

    const existingFarmer = await farmerService.createFarmer({
      name: 'John Doe',
      document: '123.456.789-02',
      farm: {
        name: 'Green Farm',
        state: 'Some State',
        city: 'Some City',
        totalArea: 1000,
        agriculturalArea: 800,
        vegetationArea: 200,
        crops: [1]
      }
    });

    await farmerService.deleteFarmer(existingFarmer);

    const deletedFarmer = await Farmer.find(existingFarmer.id);
    const deletedFarm = await Farm.find(existingFarmer.farmId);

    assert.isNull(deletedFarmer);
    assert.isNull(deletedFarm);
  });

});
