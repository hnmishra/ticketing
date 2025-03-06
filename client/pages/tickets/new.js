
import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';


export default function newTicket() {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const {doRequest, errors} = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title,
            price
        },
        onSuccess: () => Router.push('/')

});

const onBlur=() => {      // onBlur event is triggered when an element loses focus
    const value = parseFloat(price);
    if (isNaN(value)) {
        return;
    }
    setPrice(value.toFixed(2));
}

const onSubmit = async (event) => {
    event.preventDefault();
    doRequest();
}

    return (
        <div>
            <form onSubmit={onSubmit}>
                <h1>Create a Ticket</h1>
                <div className='form-group'>
                    <label>Title</label>
                    <input value={title} onChange={e => setTitle(e.target.value)} type="text" name="title" className='form-control' />
                </div>
                <div className='form-group'>
                    <label>Price</label>
                    <input 
                    onBlur={onBlur}
                    value={price} onChange={e => setPrice(e.target.value)} 
                    type="text" name="price" className='form-control'
                    />
                </div>
                {errors}
                <button type="submit">Submit</button>
            </form>
        </div>
    )

}
