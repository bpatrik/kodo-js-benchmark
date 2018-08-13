import {LogDTO} from '../../common/LogDTO';
import {IPlotable, IPlotData} from './IPlotable';
import {Utils} from '../../common/Utils';
import {CompilationType} from '../../common/LibInfoDTO';

export class Renderer {


  private static getColor(log: LogDTO) {
    switch (log.lib.type) {
      case CompilationType.ASM:
        return 'green';
      case CompilationType.WASM:
        return 'blue';
    }
  }

  private static getLineDash(log: LogDTO) {
    if (log.lib.flags.indexOf('-O2') != -1 &&
      log.lib.flags.indexOf('--cxx_nodebug') != -1 &&
      log.lib.flags.indexOf('-s ALLOW_MEMORY_GROWTH=1') != -1) {
      return 'solid';
    }
    if (log.lib.flags.indexOf('-O2') != -1 &&
      log.lib.flags.indexOf('-s ALLOW_MEMORY_GROWTH=1') != -1) {
      return 'dashdot';
    }
    if (log.lib.flags.indexOf('-O2') != -1) {
      return 'dot';
    }
    console.log('longdash');
    return 'longdash';
  }

  public static renderLine(input: {
    logs: LogDTO[],
    yFn: (log: LogDTO) => { value: number, error: number },
    xFn: (log: LogDTO) => string | number,
    name?: (log: LogDTO) => string,
    titles: { x: string, y: string, main: string }
  }): IPlotable {

    const hash: { [key: string]: IPlotData } = {};
    for (let i = 0; i < input.logs.length; i++) {
      const name = input.name(input.logs[i]);
      hash[name] = hash[name] || {
        x: [],
        y: [],
        name: name,
        type: 'scatter',
        line: {
          dash: this.getLineDash(input.logs[i]),
          color: this.getColor(input.logs[i]),
          width: 4
        },
        marker: {
          //  symbol: this.getMarkers(name),
          color: this.getColor(input.logs[i]),
          size: 10
        }
      };

      hash[name].x.push(input.xFn(input.logs[i]));
      const v = input.yFn(input.logs[i]);
      hash[name].y.push(v.value);

      if (!hash[name].error_y) {
        hash[name].error_y = {
          type: 'data',
          array: [],
          visible: true,
          color: this.getColor(input.logs[i])
        };
      }
      hash[name].error_y.array.push(v.error);

    }

    let max = 0;
    max = Utils.max(Object.keys(hash).map(k => hash[k])
      .map(v => Utils.max(v.y.map((_, i) => v.y[i] + v.error_y.array[i])))) * 1.1;

    const ret = {
      data: Object.keys(hash).sort().map(k => hash[k]),
      layout: {
        title: input.titles.main,
        xaxis: {
          zeroline: true,
          title: input.titles.x
        },
        yaxis: {
          range: [0, max],
          zeroline: true,
          title: input.titles.y
        }
      }
    };
/*
    // remove holes
    for (let i = 0; i < ret.data.length; i++) {
      for (let j = 0; j < ret.data.length; j++) {
        if (i === j) {
          continue;
        }
        let k1 = 0;
        let k2 = 0;
        while (k1 < ret.data[i].x.length && k2 < ret.data[j].x.length) {
          if (ret.data[i].x[k1] !== ret.data[j].x[k2]) {
            if (ret.data[i].x.indexOf(ret.data[j].x[k2]) === -1) {
              ret.data[j].x.splice(k2, 1);
              ret.data[j].y.splice(k2, 1);
              ret.data[j].error_y.array.splice(k2, 1);
              k2--;
            } else {
              ret.data[i].x.splice(k1, 1);
              ret.data[i].y.splice(k1, 1);
              ret.data[i].error_y.array.splice(k1, 1);
              k1--;
            }
          }
          k1++;
          k2++;
        }
      }
    }
    ret.data.forEach(d => {
      if (d.y.length !== d.x.length) {
        throw new Error('y length mismatch, at' + input.titles.main);
      }
      if (d.y.length !== d.error_y.array.length) {
        throw new Error('error_y length mismatch, at' + input.titles.main);
      }
    });*/
    return ret;
  }

}
