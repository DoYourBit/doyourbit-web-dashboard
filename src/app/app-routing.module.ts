import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'politica-privacitat', component: PrivacyPolicyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
