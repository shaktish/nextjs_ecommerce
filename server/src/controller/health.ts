import { Request, Response } from "express";

const healthChecker = (req: Request, res: Response) => {
    res.status(200).send("ok");
}

export { healthChecker }