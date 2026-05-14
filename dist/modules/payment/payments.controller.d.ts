import { RawBodyRequest } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
export declare class PaymentsController {
    private readonly payments;
    constructor(payments: PaymentGatewayService);
    stripeOrder(req: any, body: {
        courseId: string;
        amount: number;
        couponCode?: string;
    }): Promise<{
        payment: import("mongoose").Document<unknown, {}, import("./schemas/payment.schema").PaymentDocument, {}, {}> & import("./schemas/payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        clientSecret: string;
        message: string;
    }>;
    rzpOrder(req: any, body: {
        courseId: string;
        amount: number;
        couponCode?: string;
    }): Promise<{
        payment: import("mongoose").Document<unknown, {}, import("./schemas/payment.schema").PaymentDocument, {}, {}> & import("./schemas/payment.schema").Payment & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        keyId: string;
        orderId: string;
        message: string;
    }>;
    stripeWebhook(req: RawBodyRequest<Request>, sig: string): {
        received: boolean;
    };
    rzpWebhook(body: any): {
        received: boolean;
    };
}
