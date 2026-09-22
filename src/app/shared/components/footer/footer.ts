// import { Component, computed, inject } from '@angular/core';
// import { HospitalName } from '@shared/constants/app-routes.constants';
// import { NgOptimizedImage } from '@angular/common';
// import { Theme } from '@core/services/theme';
// import { RouterLink } from '@angular/router';
// import { provideTranslocoScope, TranslocoPipe } from '@jsverse/transloco';

// @Component({
//   selector: 'app-footer',
//   imports: [NgOptimizedImage, RouterLink,TranslocoPipe],
//   templateUrl: './footer.html',
//   styleUrl: './footer.css',
//   providers: [
//     provideTranslocoScope({
//       scope: 'layout/footer',
//       alias: 'footer',
//     }),
//   ],
// })
// export class Footer {
//   protected readonly hospitalName = HospitalName;
//   protected readonly currentYear = computed(() => new Date().getFullYear());
//   private readonly theme = inject(Theme);

//   readonly isDark = this.theme.isDark;
// }
