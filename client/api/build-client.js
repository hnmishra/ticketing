import axios  from "axios";

export default ({ req }) => { 
    if (typeof window==='undefined') {
     // Request should be made to http://ingress-nginx.ingress-nginx.svc.cluster.local
    //domoain name should be SERVICE_NAME.NAMESPACE.svc.cluster.local
   // We are on the server'
    return axios.create({
        baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
        headers: req.headers
        });
    
    } else {
    // We are on the browser 
    // Request can be made with a base url of ''
        return axios.create({
            baseURL: '/'
          }); 
        }
    };
 