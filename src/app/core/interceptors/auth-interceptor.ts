import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { IdentityService } from '../services/identity-service';
import { catchError, throwError, retry, timer } from 'rxjs';
import { Router } from '@angular/router';
import { AppMessageService } from '@core/services/app-message-service';
import { AuthFacade } from '@features/auth/services/auth.facade';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const identityService = inject(IdentityService);
  const authFacade = inject(AuthFacade);
  const appmsg = inject(AppMessageService);
  const router = inject(Router);

  const token = identityService.token();
  let clonedReq = req;

  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(clonedReq).pipe(
    // إعدادات إعادة المحاولة الذكية
    retry({
      count: 2, // يحاول مرتين إضافيتين بعد الفشل الأول
      delay: (error: HttpErrorResponse, retryCount) => {
        // نكرر المحاولة فقط في حالة أخطاء السيرفر المؤقتة أو انقطاع الشبكة
        const transientErrors = [0, 408, 500, 502, 503, 504];
        if (transientErrors.includes(error.status)) {
          // Exponential Backoff: ينتظر ثانية ثم ثانيتين
          return timer(retryCount * 1000);
        }
        // لو الخطأ مش مؤقت (زي 401)، ارمي الخطأ فوراً ومتحاولش تاني
        return throwError(() => error);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        appmsg.addWarnMessage('انتهت الجلسة، جاري تحويلك لتسجيل الدخول...');
        authFacade.logout();
        if (!router.url.includes('/login')) {
          router.navigate(['/login']);
        }
      }

      // إذا استمر الخطأ بعد محاولات الـ retry
      if (error.status === 0) {
        appmsg.addErrorMessage('تأكد من اتصالك بالإنترنت وحاول مرة أخرى');
      }

      return throwError(() => error);
    }),
  );
};
