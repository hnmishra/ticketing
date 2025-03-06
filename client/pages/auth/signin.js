
import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';


export default function Signup() {      
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {doRequest, errors} = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email,
            password
        },
        onSuccess: () =>  Router.push('/') // redirect to landing page
    });


const onSubmit = async (event) => {
    event.preventDefault();
    doRequest();
    // following code is replaced by  useRequest(dooRequest()) Hook
    // try {
    //     const response = await axios.post('/api/users/signup', {
    //         email,
    //         password
    //     });
    //     console.log(response.data);
    // } catch (err) {
    //     console.error(err.response.data);
    //     setError(err.response.data.errors);
    // };
};
    return (
        <div>
            <h1>Sign In</h1>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" name="email" className='form-control' />
                </div>
                <div className='form-group'>
                    <label>Password</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" name="password" className='form-control' />
                </div>
                {errors}    
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}
