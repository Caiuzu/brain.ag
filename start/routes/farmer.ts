import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.get('/farmer', 'FarmersController.index')
    Route.get('/farmer/:id', 'FarmersController.show')
    Route.post('/farmer', 'FarmersController.store')
    Route.put('/farmer/:id', 'FarmersController.update')
    Route.delete('/farmer/:id', 'FarmersController.destroy')
}).prefix('/api');
