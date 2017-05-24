import { ProfileComponent } from './component/profile/profile.component';
import { AuthGuardService } from './services/auth-guard.service';
import { RouterModule, Routes } from "@angular/router";
import { ProtegidaComponent } from './component/protegida/protegida.component';
import { PreciosComponent } from './component/precios/precios.component';
import { HomeComponent } from './component/home/home.component';


const APP_ROUTES: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'precios', component: PreciosComponent},
    {
        path: 'protegida', 
        component: ProtegidaComponent,
        canActivate:[
            AuthGuardService
        ]
    },
    {
        path: 'perfil', 
        component: ProfileComponent,
        canActivate:[
            AuthGuardService
        ]
    },
    {path: '**', pathMatch: 'full', redirectTo: 'home'}
]

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES)

