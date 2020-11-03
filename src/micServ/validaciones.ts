
class Validaciones {

    validaNombre(nombre: string) {
        if (nombre.length <= 50 && nombre.length > 0 ) {
            return true;
        }else{
            return false;
        }
    }

    validaCorreo(correo: string) {
        const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if ( emailRegex.test(correo) && correo.length <= 50 && correo.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    validarol(rol: string){
        if (rol == 'AD' || rol == 'PROF' || rol == 'STU') {
            return true;
        } else {
            return false;
        }
    }
}

const validaciones = new Validaciones();
export default validaciones;