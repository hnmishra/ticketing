import {Publisher,Subjects,ExpirationCompleteEvent} from '@hnticketing/common'
   
export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}