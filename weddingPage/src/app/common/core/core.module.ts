import { NgModule } from "@angular/core";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { PageTitleComponent } from "./components/pageTitle/pageTitle.component";
import { CarouselComponent } from "./components/carousel/carousel.component";
import { CommonModule } from "@angular/common";
import { LoaderComponent } from "../shared/animations/loader/loader.component";

@NgModule({
    declarations:[
        NavBarComponent,
        PageTitleComponent,
        CarouselComponent,
        LoaderComponent
    ],
    imports:[CommonModule],
    exports:[
        NavBarComponent,
        PageTitleComponent,
        CarouselComponent,
        LoaderComponent
    ]
})
export class CoreModule{

}