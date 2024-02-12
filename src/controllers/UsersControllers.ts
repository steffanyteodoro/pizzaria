import {Request, Response} from 'express';
import UsersServices from '../service/UsersServices'

export default class UsersControllers {
  public async AuthUser(req: Request, res: Response) {
    const {email, password} = req.body;

    const usersServices = new UsersServices();

    const auth = await usersServices.AuthUserService({
      email,
      password
    })

    return res.json(auth);
  }

  public async CreateUser(req: Request, res: Response) {
    const {name, email, password} = req.body;

    const usersServices = new UsersServices();

    const user = await usersServices.CreateUser({
      name, 
      email, 
      password
    })

    return res.json(user)
  }

  public async DetailUser(req: Request, res: Response) {
    const user_id = req.user_id;

    const usersServices = new UsersServices();

    const user = await usersServices.DetailUser(user_id);

    return res.json(user);
  }
}