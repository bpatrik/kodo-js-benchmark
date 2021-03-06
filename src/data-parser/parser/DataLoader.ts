import * as fs from 'fs';
import * as path from 'path';
import {ProjectPath} from '../../backend/ProjectPath';
import {LogDTO} from '../../common/LogDTO';

export class DataLoader {

  public static loadFolder(): LogDTO[] {
    const resultFileList = fs.readdirSync(ProjectPath.LogFolder).filter(i => path.extname(i) === '.jsonx');
    const logs = resultFileList.map(f => this.loadResult(f));
    return [].concat.apply([], logs);
  }

  public static loadResult(file: string): LogDTO[] {

    console.log('Reading file:' + file);
    let logFile = fs.readFileSync(path.join(ProjectPath.LogFolder, file), 'utf8');


    logFile = logFile.trim();
    logFile = logFile.slice(-1) === ',' ? logFile.substring(0, logFile.length - 1) : logFile;
    return JSON.parse('[' + logFile + ']');

  }
}
