import {FileLogger} from './FileLogger';
import {ProjectPath} from '../ProjectPath';
import {LogDTO} from '../../common/LogDTO';
import * as fs from 'fs';


export class StatisticFileLogger extends FileLogger {


  constructor() {
    super(ProjectPath.LogFolder, '.jsonx');
  }


  public log(log: LogDTO) {
    if (!fs.existsSync(this.filePath)) {
      return super.logString(JSON.stringify(log));
    }
    return super.logString(',\n' + JSON.stringify(log));
  }
}
