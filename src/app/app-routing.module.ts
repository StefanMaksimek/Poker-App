import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { GameComponent } from './main/game/game.component';
import { HomeComponent } from './main/home/home.component';
import { LobbyComponent } from './main/lobby/lobby.component';
import { RulesComponent } from './main/rules/rules.component';
import { SettingsComponent } from './main/settings/settings.component';
import { UserComponent } from './main/user/user.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'lobby', component: LobbyComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'game', component: GameComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'user', component: UserComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
