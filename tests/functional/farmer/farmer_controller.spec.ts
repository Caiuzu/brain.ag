import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Farmer Controller', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('should list all farmers', async ({ client, assert }) => {
    const response = await client.get('/api/farmer')

    response.assertStatus(200)

    assert.isArray(response.body())
    assert.lengthOf(response.body(), 10)
    assert.equal(response.body()[0].name, 'João Silva')
    assert.equal(response.body()[9].name, 'Tiago Oliveira')
  })

  test('should show a farmer', async ({ client, assert }) => {
    const response = await client.get('/api/farmer/1')

    response.assertStatus(200)
    assert.equal(response.body().name, 'João Silva')
  })

  test('should delete a farmer', async ({ client, assert }) => {
    const response = await client.delete('/api/farmer/1')

    response.assertStatus(200)
    assert.equal(response.body().message, 'Farmer successfully deleted.')
  })
})
