import { Request, Response, Router } from 'express';
import path from 'path';

import leerExcel from '../micServ/leeDatos';
import validaciones from '../micServ/validaciones';
import BDMysql from '../micServ/cargarBD';

interface User{
    name: string;
    email: string;
    code: string;
}

class UserRoutes {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    public getUsers(req: Request, res: Response) {
        let con = BDMysql.cargarTodos();
        let usuarios: { id: any; name: any; email: any; role: { id: number; name: string; code: string; } | undefined; }[] = [];

        con.query('SELECT * FROM usuarios', (error, filas) => {
            if (error) {
                throw error;
            } else {
                let code;
                for (const iteam of filas) {
                    switch (iteam.role) {
                        case 'AD':
                            code = {
                                    "id":1,
                                    "name":"Administrador",
                                    "code": "AD"
                                }
                            break;
                        case 'PROF':
                            code = {
                                    "id":2,
                                    "name":"Profesor",
                                    "code": "PROF"
                                }
                            break;
                        case 'STU':
                            code = {
                                    "id":3,
                                    "name":"Estudiante",
                                    "code": "STU"
                                }
                            break;
                        default:
                            break;
                    }

                    usuarios.push(
                        {
                            "id":iteam.id,
                            "name":iteam.nombre,
                            "email":iteam.correo,
                            "role": code
                        }        
                    );
                }
            }
            res.json({
                data: usuarios
            });
        });
    }

    getUser(req: Request, resp: Response) {
        let con = BDMysql.cargarUno();
        con.query('SELECT * FROM usuarios WHERE id = ?', [req.params.id], (err, rows, fiels) => {
            if (!err) {
                resp.json(rows);
            }else{
                console.log(err);
            }
        });
    }

    public async importUsers( req: Request, resp: Response): Promise<void> {
        let data: User[] = leerExcel();
        let result = [];
        const emails = [];

         for (const user of data) {
            let vName = validaciones.validaNombre(user.name);
            let vEmail = validaciones.validaCorreo(user.email);
            let vRole = validaciones.validarol(user.code);
            
            let uniqEmail = !emails.includes( user.email );
            emails.push(user.email);

            let status = 'failed';
            if (vName && vEmail && vRole){
                status = 'success';
            }

            if (vName && vEmail && vRole && uniqEmail) {
                BDMysql.insertar(user);
            }

            result.push(
                {
                status:[
                    {
                        "name": user.name,
                        "email": user.email,
                        "code": user.code
                    }],
                    "validation":[
                    {
                        "name":
                        {
                            "value": user.name,
                            "validation": vName
                        },
                        "email":
                        {
                            "value": user.email,
                            "validation": vEmail,
                            "Repetido": uniqEmail
                        },
                        "role":
                        {
                            "value": user.code,
                            "validation": vRole
                        }
                    }]
                }
            );

        }
        try {
            resp.json({
                "error":"",
                "code":200,
                "hint":"success",
                "message":"success",
                    "data": result
                });
        } catch (error) {
            resp.json(
                {
                    "error":"failed",
                    "code":409,
                    "hint":"error",
                    "message":"Error al importar datos :motivo_error",
                    "data": error
                    }
                    
            )
        }
    }

    routes() {
        this.router.get('/', this.getUsers);
        this.router.get('/:id', this.getUser);
        this.router.post('/import', this.importUsers);
    }
}

const userRoutes = new UserRoutes();

export default userRoutes.router;