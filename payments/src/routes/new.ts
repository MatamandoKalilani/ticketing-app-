import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@mata-ticketing/common";
import { body } from "express-validator";
import express, { Request, Response } from "express";
import { Order } from "../model/order";
import { natsWrapper } from "../nats-wrapper";
import { stripe } from "../stripe";
import { Payment } from "../model/payments";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    // Make sure Order exists
    if (!order) {
      throw new NotFoundError();
    }

    // Make sure user paying for the order, owns the order
    if (order.userId !== req.currentUser.id) {
      throw new NotAuthorizedError();
    }

    // Make sure the order is not cancelled
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Can not pay for a cancelled order");
    }

    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      stripeId: payment.stripeId,
      orderId: payment.orderId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
