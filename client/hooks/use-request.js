import axios from "axios";
import { useState } from "react";
import { Router } from "next/router";

// export default({url, method, body, onSuccess}) => {
export default function useRequest({url, method, body,onSuccess}) {
    const [errors, setError] = useState(null);

    const doRequest = async (props = {}) => { 
        try {
            setError(null);
            const response = await axios[method](url, {...body, ...props});
            if (onSuccess) {
                onSuccess(response.data);
            }   
            return response.data;
            console.log(response.data);
        } catch (err) {
            setError(
                <div className="alert alert-danger" onClick={() => setError([])}>
                    <h4>Ooops....</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map(err => (
                            <li key={err.message}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            );
        }
    }
    return {doRequest, errors};
}