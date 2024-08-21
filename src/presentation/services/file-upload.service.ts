import path from "path";
import fs from "fs";
import { UploadedFile } from "express-fileupload";
import { Uuid } from "../../config";
import { CustomError } from "../../domain";

export class FileUploadService {
  constructor(private readonly uuid = Uuid.v4) {}

  private checkFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  }

  async uploadSingle(
    file: UploadedFile,
    folder: string = "uploads",
    validExtensions: string[] = ['png', 'jpg', 'gif', 'jpeg', 'svg', 'gif']
  ) {
    try {
      // Extraer correctamente la extensión de archivo
      const fileExtension = file.mimetype.split('/').pop()?.split('+')[0] ?? '';


      if (!validExtensions.includes(fileExtension)) {
        throw CustomError.badRequest(
          `Invalid extension: ${fileExtension} valid ones: ${validExtensions}`
        );
      }

      const destination = path.resolve(__dirname, "../../../", folder);
      this.checkFolder(destination);

      const fileName = `${this.uuid()}.${fileExtension}`;

      await file.mv(`${destination}/${fileName}`);

      return { fileName };
    } catch (error) {
      throw error;
    }
  }

  async uploadMultiple(
    files: UploadedFile[],
    folder: string = "uploads",
    validExtensions: string[] = ['png', 'jpg', 'gif', 'jpeg']
  ) {
    const fileNames = await Promise.all(
      files.map((file)=>this.uploadSingle(file,folder,validExtensions))
    )

    return fileNames
  }

}
