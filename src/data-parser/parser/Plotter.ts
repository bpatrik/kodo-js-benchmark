import {IPlotable} from './IPlotable';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';


export class Plotter {

  constructor(protected outDir: string) {

  }

  public static toConsole(plotable: IPlotable) {
    console.log(JSON.stringify(plotable));
  }


  public static toJSON(plotable: IPlotable, outDir: string): Promise<void> {
    return new Promise<void>((resolve: Function, reject: Function) => {
      if (!fs.existsSync(outDir)) {
        mkdirp.sync(outDir);
      }
      let type = plotable.data[0].type;
      if (Array.isArray(plotable.data[0])) {
        type = plotable.data[0][0].type;
      }
      fs.writeFile(path.join(outDir, plotable.layout.title.toLowerCase()
          .replace(new RegExp('[!@#$%^&*(),?":{}|<>\\\\/ ]', 'g'), '_') +
        '.' + type + '.json'), JSON.stringify(plotable, null, 2), (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

  }


  public toConsole(plotable: IPlotable) {
    return Plotter.toConsole(plotable);
  }


  public toJSON(plotable: IPlotable) {
    return Plotter.toJSON(plotable, this.outDir);
  }
}
