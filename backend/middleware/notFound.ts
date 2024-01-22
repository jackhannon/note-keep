import { Request, Response } from "express"
const notFound = async ( req: Request, res: Response) => {
  res.status(404).send("invalid path")
}
export {
  notFound
}