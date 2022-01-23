import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';

interface UserPayload {
    id: string;
    email: string;
}

// This one will tell typescript in Express project, find the interface Request that was already created
// we want to add the additional property to it
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session?.jwt) {    // equivalent with operator (!req.session || !req.session.jwt)
        return next();
    }

    try {
        const payload = jwt.verify(
            req.session.jwt,
            config.get('jwt_key')!  // ! That means it will tell with typescript that doesn't worry
                                    // and just skip validate the type of property it here
        ) as UserPayload;
        req.currentUser = payload;
    } catch (err) {
        console.log(err);
    }

    next();
};
