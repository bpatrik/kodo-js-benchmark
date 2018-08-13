import * as fs from 'fs';
import * as _path from 'path';
import * as mkdirp from 'mkdirp';
import {Utils} from '../../common/Utils';


export abstract class FileLogger {

  protected fileBase: string = null;
  protected fileNameCounter = 0;
  protected filePath: string;
  protected logCount = 0;

  protected constructor(protected folder: string, protected extension: string) {
    this.newFile();
  }

  public static getTimeString() {
    const date = new Date();
    return date.getFullYear() + '' +
      Utils.zeroPrefix((date.getMonth() + 1), 2) +
      Utils.zeroPrefix(date.getDate(), 2) + '-' +
      Utils.zeroPrefix(date.getHours(), 2) +
      Utils.zeroPrefix(date.getMinutes(), 2) +
      Utils.zeroPrefix(date.getSeconds(), 2);
  }

  private generateLogFileName(): string {
    if (!fs.existsSync(this.folder)) {
      mkdirp.sync(this.folder);
    }
    let i = 0;
    const prefix = 'log_' + FileLogger.getTimeString();
    try {
      while (true) {
        const fileName = prefix + (i === 0 ? '' : ('_' + i));
        if (!fs.existsSync(_path.join(this.folder, fileName + this.extension))) {
          return fileName;
        }
        i++;
      }
    } catch (e) {
      console.error(e);
    }
  }

  protected newFile() {
    if (!this.fileBase) {
      this.fileBase = this.generateLogFileName();
    }
    if (this.fileNameCounter > 0) {
      this.filePath = _path.join(this.folder, this.fileBase + '_' + this.fileNameCounter + this.extension);
    } else {
      this.filePath = _path.join(this.folder, this.fileBase + this.extension);
    }
    this.fileNameCounter++;
  }

  protected onNewFile(): string {
    return null;
  }

  private _logString(data: string): Promise<void> {

    return new Promise((resolve) => {
      fs.appendFile(this.filePath, data, (err) => {
        this.logCount++;
        if (err) {
          console.error('Error during saving log, path:', this.filePath, err);
        }
        return resolve();
      });
    });
  }

  protected async logString(data: string): Promise<void> {
    if (!fs.existsSync(this.filePath)) {
      const newFile = this.onNewFile();
      if (newFile !== '' && newFile !== null) {
        await this._logString(newFile);
      }
    }
    return await this._logString(data);
  }


}
