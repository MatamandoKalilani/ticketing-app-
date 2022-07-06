import React, { useEffect } from "react";
import ErrorBox from "../../components/ErrorBox";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import StripeCheckout from "react-stripe-checkout";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = React.useState<number>(0);

  useEffect(() => {
    const findTimeLeft = () => {
      //@ts-ignore
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.floor(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });

  return (
    <div>
      <h1>{order.ticket.title}</h1>
      {timeLeft < 0 ? (
        <p>Order Expired</p>
      ) : (
        <p> {`Time left to pay: ${timeLeft} seconds `}</p>
      )}

      <StripeCheckout
        token={(token) => {
          doRequest({ token: token.id });
        }}
        stripeKey="pk_test_51LGJ6hECSK4O52tYFU0tng0jIUllaj3EkYRsNVBdnKdGhL6hWrtfHmdZYogiXtdLjLxGk6UWRlFL6lsHICr6hEKI004aFDVQAz"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors && errors.length > 0 && <ErrorBox errors={errors} />}

      {/* <h4>Price: ${order.ticket.price}</h4> */}
      {/* <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price}</h4>
      {errors && errors.length > 0 && <ErrorBox errors={errors} />}
      <button onClick={doRequest} className="btn btn-primary">
        Purchase
      </button> */}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
