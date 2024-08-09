import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { reducersGlobales } from './core/reducers/estado-global.reducer';
import { StoreModule } from '@ngrx/store';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot(reducersGlobales),
  ]
})
export class AppModule { 
  constructor(
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon(
      'instagram',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/icons8-instagram.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'face',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/icons8-facebook.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/icons8-linkedin.svg'),
    );
    this.matIconRegistry.addSvgIcon(
      'web',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/icons8-web-48.svg'),
    );
  }
}
