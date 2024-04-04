import {TOKEN_SECRET} from '../config.js';
import jwt from 'jsonwebtoken';

 export function createAccessToken (payload) {
    return new Promise ((resolve, reject) => {
        
    jwt.sign(
        payload, /*Datos que se guardan dentro del token */
        TOKEN_SECRET, 
        {
            expiresIn: "1d"
        },  (err, token) => {
            if (err) reject(err)
            resolve (token)
            // res.json({token}); /*se devuelve al cliente */
        }
        );
    } )
 }