export class Helpers {

    // Transforma una fecha en formato 'YYYY-MM-DD'
    formatDateToYMD(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes comienza desde 0
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Transforma una fecha en formato 'DD-MM-YYYY'
    formatDateToDMY(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}-${month}-${year}`;
    }

    // Transforma una fecha en formato 'DDMMYYYY hh24mmss'
    formatDateToDDMMYYYY_HHMMSS(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    // Calcula la diferencia de días entre dos fechas
    getDaysDifference(date1: Date, date2: Date): number {
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Valida si una cadena es un email
    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Genera un número aleatorio entre dos valores (min y max)
    getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Convierte una cadena a formato Title Case
    toTitleCase(str: string): string {
        return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
    }

    capitalizeName(name: string): string {
        return name.split(' ') // Dividir el nombre por espacios
                   .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()) // Capitalizar primera letra de cada palabra
                   .join(' '); // Unir las palabras de nuevo
    }

    capitalizeFirstLetter(value: string): string {
        if (!value) return value;
        return value.charAt(0).toUpperCase() + value.slice(1);
      }

}