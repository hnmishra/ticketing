import express from 'express';
import {currentUser} from '@hnticketing/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null });
    console.log("session in Current Uuser",req.session);
  });



export { router as currentUserRouter };
