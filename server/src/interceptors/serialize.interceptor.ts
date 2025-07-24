import { UseInterceptors, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable, map } from 'rxjs';

interface ClassConstructor {
    new(...args: any[]): {}
}
export function Serialize(dto: any) {
    return UseInterceptors(new serializeInterceptor(dto));
}

export class serializeInterceptor implements NestInterceptor {
    constructor(private readonly dto: ClassConstructor) { }

    intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(map((data: any) => {
            return plainToInstance(this.dto, data, {})
        }))
    }
}