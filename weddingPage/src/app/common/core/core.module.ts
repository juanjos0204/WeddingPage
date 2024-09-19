import { NgModule } from "@angular/core";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { PageTitleComponent } from "./components/pageTitle/pageTitle.component";

@NgModule({
    declarations:[
        NavBarComponent,
        PageTitleComponent,
    ],
    imports:[],
    exports:[
        NavBarComponent,
        PageTitleComponent,
    ]
})
export class CoreModule{

}