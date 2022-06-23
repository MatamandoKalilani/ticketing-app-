import express, { Request, Response } from "express";
import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@mata-ticketing/common";
import { param } from "express-validator";
import mongoose from "mongoose";
import { Order } from "../model/order";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  [
    param("orderId")
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("invalid orderId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    //Find Order
    const order = await Order.findById(orderId).populate("ticket");

    //Send Error if Order does not exist
    if (!order) {
      throw new NotFoundError();
    }

    //Send error if user cancelling order is not the owner of the order
    if (order.userId !== req.currentUser.id) {
      throw new NotAuthorizedError();
    }

    // Cancel order
    order.status = OrderStatus.Cancelled;

    //Save Order
    await order.save();

    //Publish event
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
