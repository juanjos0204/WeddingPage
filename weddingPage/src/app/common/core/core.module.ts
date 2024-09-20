import { NgModule } from "@angular/core";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { PageTitleComponent } from "./components/pageTitle/pageTitle.component";
import { CarouselComponent } from "./components/carousel/carousel.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations:[
        NavBarComponent,
        PageTitleComponent,
        CarouselComponent,
    ],
    imports:[CommonModule],
    exports:[
        NavBarComponent,
        PageTitleComponent,
        CarouselComponent,
    ]
})
export class CoreModule{

}