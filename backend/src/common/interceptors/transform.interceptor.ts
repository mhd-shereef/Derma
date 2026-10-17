import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse, PaginationMeta } from '../types/response.types';

export interface ResponseWithMeta<T> {
  data: T;
  meta?: PaginationMeta;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((response: T | ResponseWithMeta<T>) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          'meta' in response
        ) {
          const { data, meta } = response as ResponseWithMeta<T>;
          return {
            success: true,
            data,
            meta,
          } as ApiResponse<T>;
        }

        return {
          success: true,
          data: response,
        } as ApiResponse<T>;
      }),
    );
  }
}