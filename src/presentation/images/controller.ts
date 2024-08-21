import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export class ImageController {
  constructor() {}



  getImages =  (req: Request, res: Response) => {
    const { type = '', img = '' } = req.params;

    const imagepath = path.resolve(__dirname, `../../../uploads/${type}/${img}`);

    if (!fs.existsSync(imagepath)) {
      return res.status(404).send("Image not found");
    }

    res.sendFile(imagepath);
  };
}
