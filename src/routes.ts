import {Router, Request, Response} from 'express';

import UsersControllers from './controllers/UsersControllers';

import isAuthenticate from './middlewares/isAuthenticate';

const router = Router();

// Rotas Users
router.post('/users', new UsersControllers().CreateUser)
router.post('/session', new UsersControllers().AuthUser)
router.get('/me', isAuthenticate, new UsersControllers().DetailUser)

export {router};