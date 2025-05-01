/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js';
const HomeController = () => import('#controllers/home_controller');
const LoginController = () => import('#controllers/login_controller');

// router.get('/', async () => 'It works!')
router.get('/', [LoginController, 'show']).as('login');
router.post('/login', [LoginController, 'login']).as('login.user');
router.group(() => {
    router.get('logout', [LoginController, 'logout']).as('logout');
    router.get('/dashboard', [HomeController, 'index']).as('index');
    router.get('/create', [HomeController, 'create']).as('create');
    router.post('store', [HomeController, 'store']).as('store');
    router.get('/edit/:id', [HomeController, 'edit']).as('edit');
    router.get('/view/:id', [HomeController, 'view']).as('view');
    router.post('/update/:id', [HomeController, 'update']).as('update');
    router.get('/destroy/:id', [HomeController, 'destroy']).as('destroy');
}).use(middleware.auth())


