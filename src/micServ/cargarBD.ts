import mysql from 'mysql';

class BDMysql {

    public conexion!: mysql.Connection;
    public usuarios: any[] = [];

    constructor() {
        this.iniciar();
    }

    iniciar() {
        // Mysql
        this.conexion = mysql.createConnection({
            host: 'localhost',
            database: 'apithy_db',
            user: 'apithy',
            password: 'apithy',
            port: 3308
        });

        this.conexion.connect((error) => {
            if (error) {
                throw error;
            }else{
                console.log('Conexión db exitosa');
            }
        });
    }

    cargarTodos() {
        return this.conexion;
    }

    cargarUno() {
        return this.conexion;
    }

    insertar( data: any ) {
        this.conexion.query( 'INSERT INTO usuarios (nombre, correo, role) VALUES ("' + data.name + '","' + data.email + '","' + data.code + '")' , (error, results) => {
            if (error) throw error;
            // console.log('Registro agregado', results);
        });
    }

}

const dbmysql = new BDMysql;
export default dbmysql;