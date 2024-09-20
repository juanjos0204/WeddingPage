import { Component } from "@angular/core";

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
    
    carouselItems = [
        {
          title: 'Nos conocimos',
          text: 'La vida nos brindó la oportunidad de encontrarnos en el momento justo, dándonos el tiempo necesario para conocer y apreciar la esencia del otro. En 2022, nuestros caminos se cruzaron, y desde entonces, una sonrisa ha sido la compañía constante en nuestro viaje juntos.'
        },
        {
          title: 'Nos enamoramos',
          text: 'Las acciones desinteresadas y la dulzura de las palabras fueron moldeando un sentimiento que llenó de alegría nuestras miradas y dio vida a un amor que creció cada día más.'
        },
        {
          title: '¡Nos casamos!',
          text: 'Es un honor para nosotros compartir este momento tan especial contigo, celebrando juntos la alegría de nuestro matrimonio y el inicio de una nueva etapa en nuestras vidas.'
        }
      ];

    
    //   redirectOutSide() {
    //     window.open('https://holdingsoft.com/pricing-plans/?v=5bfe619476f8', '_blank');
    //   }
}