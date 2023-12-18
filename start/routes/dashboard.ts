import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
    Route.get('/dashboard/total-farms', 'DashboardController.getTotalFarmsAndArea');
    Route.get('/dashboard/farms-by-state', 'DashboardController.getFarmsByState');
    Route.get('/dashboard/farms-by-crop', 'DashboardController.getFarmsByCrop');
    Route.get('/dashboard/land-use', 'DashboardController.getLandUse');
}).prefix('/api');
