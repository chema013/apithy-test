import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import compression from 'compression';
import cors from 'cors';
import mysql from 'mysql';

import BDMysql from './micServ/cargarBD';
import leerExcel from './micServ/leeDatos';

import indexRoutes from './routes/indexRoutes';
import userRoutes from './routes/userRoutes';
// import postRoutes from './routes/postRoutes';

class Server {

    public app: express.Application;
    public dataExcel: any;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        // this.leerExcel();
        // this.cargarBD();
    }

    config() {
        // Mysql
        
        // settings
        this.app.set('port', process.env.PORT || 3000);
        //Middleware
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }

    routes() {
        this.app.use(indexRoutes);
        this.app.use('/users', userRoutes);
        // this.app.use('/api/posts', postRoutes);
    }

    start() {
        this.app.listen( this.app.get('port'), () => {
            console.log('Server on port ', this.app.get('port'));
        });
    }

    leerExcel() {
        this.dataExcel = leerExcel();
    }

    cargarBD() {
        BDMysql.insertar(this.dataExcel);
    }

}

const server = new Server();
server.start();