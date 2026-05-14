import { Body, Controller, Post, Req, Headers, RawBodyRequest, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentGatewayService } from './payment-gateway.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentGatewayService) {}

  @Post('stripe/order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  stripeOrder(@Request() req: any, @Body() body: { courseId: string; amount: number; couponCode?: string }) {
    return this.payments.createStripeLikeOrder(req.user._id.toString(), body.courseId, body.amount, body.couponCode);
  }

  @Post('razorpay/order')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  rzpOrder(@Request() req: any, @Body() body: { courseId: string; amount: number; couponCode?: string }) {
    return this.payments.createRazorpayLikeOrder(req.user._id.toString(), body.courseId, body.amount, body.couponCode);
  }

  @Post('webhook/stripe')
  stripeWebhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') sig: string) {
    this.payments.logWebhook('stripe', { sig, body: req.body });
    return { received: true };
  }

  @Post('webhook/razorpay')
  rzpWebhook(@Body() body: any) {
    this.payments.logWebhook('razorpay', body);
    return { received: true };
  }
}
