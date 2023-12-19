import { test } from '@japa/runner';
import Database from '@ioc:Adonis/Lucid/Database';

const STRING_DIGITS = /^\d+$/;
const DIGITS_WITH_OPTIONAL_DECIMAL = /^\d+(\.\d+)?$/;

test.group('Dashboard Controller', (group) => {

  group.each.setup(async () => {
    await Database.beginGlobalTransaction();
    return () => Database.rollbackGlobalTransaction();
  });

  test('should return total number of farms and total area', async ({ client, assert }) => {
    const response = await client.get('/api/dashboard/total-farms');

    response.assertStatus(200);

    assert.match(response.body().totalFarms, STRING_DIGITS);
    assert.match(response.body().totalArea, DIGITS_WITH_OPTIONAL_DECIMAL);

    assert.deepEqual(response.body(), {
      totalFarms: "10",
      totalArea: "12150.00"
    });
  });

  test('should return farms grouped by state', async ({ client, assert }) => {
    const response = await client.get('/api/dashboard/farms-by-state');

    response.assertStatus(200);

    response.body().forEach(item => {
      assert.property(item, 'state')
      assert.match(item.total, STRING_DIGITS)
    });

    assert.deepEqual(response.body(), [
      { state: "Mato Grosso do Sul", total: "1" },
      { state: "Goiás", total: "2" },
      { state: "Paraná", total: "1" },
      { state: "Rio Grande do Sul", total: "2" },
      { state: "Tocantins", total: "1" },
      { state: "Maranhão", total: "1" },
      { state: "São Paulo", total: "1" },
      { state: "Mato Grosso", total: "1" }
    ]);
  });

  test('should return farms grouped by crop', async ({ client, assert }) => {
    const response = await client.get('/api/dashboard/farms-by-crop');

    response.assertStatus(200);

    response.body().forEach(item => {
      assert.property(item, 'name')
      assert.match(item.total, STRING_DIGITS)
    });

    assert.deepEqual(response.body(), [
      { name: "Café", total: "4" },
      { name: "Cana de Açúcar", total: "4" },
      { name: "Soja", total: "4" },
      { name: "Algodão", total: "5" },
      { name: "Milho", total: "5" }
    ]);
  });

  test('should return land use data by state', async ({ client, assert }) => {
    const response = await client.get('/api/dashboard/land-use');

    response.assertStatus(200);

    response.body().forEach(item => {
      assert.property(item, 'state');
      assert.match(item.agricultural, DIGITS_WITH_OPTIONAL_DECIMAL);
      assert.match(item.vegetation, DIGITS_WITH_OPTIONAL_DECIMAL);
    });

    assert.deepEqual(response.body(), [
      { state: "Mato Grosso do Sul", agricultural: "800.00", vegetation: "200.00" },
      { state: "Goiás", agricultural: "2900.00", vegetation: "1000.00" },
      { state: "Paraná", agricultural: "750.00", vegetation: "200.00" },
      { state: "Rio Grande do Sul", agricultural: "2200.00", vegetation: "1400.00" },
      { state: "Tocantins", agricultural: "900.00", vegetation: "200.00" },
      { state: "Maranhão", agricultural: "700.00", vegetation: "250.00" },
      { state: "São Paulo", agricultural: "650.00", vegetation: "200.00" },
      { state: "Mato Grosso", agricultural: "920.00", vegetation: "200.00" }
    ]);
  });

});