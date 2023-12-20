import Route from '@ioc:Adonis/Core/Route'
import './routes/healthcheck'
import './routes/farmer'
import './routes/dashboard'

Route.get('/', async () => {
  return { welcome: 'brain.ag' }
})
