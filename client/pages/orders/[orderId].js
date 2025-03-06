
import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';


const OrderShow = ({ order,currentUser }) => {
    const [timeLeft,setTimeLeft]=useState(0);

    const {doRequest,errors} = useRequest({
        url:'/api/payments',
        method:'post',
        body:{
            orderId: order.id
        },
        onSuccess:(payment) => console.log(payment)
    });
 

useEffect(() => {
    const findTimeLeft = () => {
    const msLeft = new Date(order.expiresAt) -new Date();
    setTimeLeft(Math.round(msLeft/1000));
    };
    findTimeLeft();

   const timeId= setInterval(findTimeLeft,1000);
    return () => {
        clearInterval(timeId);
    };
}, [order]);

if (timeLeft < 0) {
    return <div>Order Expired</div>;
}

return (
    <div> Time Left to Pay {timeLeft} Seconds
     <StripeCheckout
      //   token={(token ) => console.log(token)}
        token={({id} ) => doRequest({ token: id})}
    
        //get this Publishable key from https://dashboard.stripe.com/test/apikeys
        // this is publikc key so sharing this key with outside workd is not an threat
        stripeKey="pk_test_51QyW8mP1xwODgLtC0b7wFjNLxNfzjPAMOktgmBofCTWA3Jql2lkBDm2e5WdnoT8aHM59XuEQ0gpmgxZplBcgz4xy00jl9aMWy1"
        amount={order.ticket.price * 100}  //sent the amount in centspk_test_51QyW8mP1xwODgLtCQjMjxsD9AiCkVLO2xbnz0b38eXpaC5prGy4fyeTKBEY5IqZpEGjQLJ01pL0WqYqDmou99mt00kZgVlcnl
        email={currentUser.email}
     />
       {errors}
    </div>
)
}   
OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    console.log(data);
    return { order: data };
}
export default OrderShow;