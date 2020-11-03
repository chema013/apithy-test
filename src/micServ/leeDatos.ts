import XLSX from 'xlsx';
import path from 'path';

const leerExcel = ( ): any[] => {
    const ruta = path.join(__dirname, 'public/' + 'apithy-test.xlsx')
    const workbook = XLSX.readFile(ruta);
    const workbookSheets = workbook.SheetNames;
    const sheet = workbookSheets[0];
    const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

    return dataExcel;
}

export default leerExcel;