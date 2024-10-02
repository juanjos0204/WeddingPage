import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  sendEmail(formData: any) {
    emailjs.init('sF0LQ9ZDd9SzwZn6k');  // Mover la inicialización aquí
    const serviceID = 'service_3ac1vgg';
    const templateID = 'template_dwpkjqj';

    return emailjs.send(serviceID, templateID, formData)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        return response;
      })
      .catch((err) => {
        console.error('FAILED...', err);
        throw err;
      });
  }
}
