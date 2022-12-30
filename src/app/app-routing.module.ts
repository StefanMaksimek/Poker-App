import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { LobbyComponent } from './main/lobby/lobby.component';
import { RulesComponent } from './main/rules/rules.component';
import { SettingsComponent } from './main/settings/settings.component';
import { UserComponent } from './main/user/user.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'user', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
