import {Renderer} from './Renderer';
import {IPlotable} from './IPlotable';
import {EnvionmentType, LogDTO} from '../../common/LogDTO';
import {DataStatisticUtils} from './DataStatistic';
import {Utils} from '../../common/Utils';

export class PlotsGenerator {


  xFn;
  xAxis: string;
  filteredLogs: LogDTO[][];
  names: string[];

  constructor(protected logs: LogDTO[]) {


  }

  perSymbols() {
    this.xFn = (l: LogDTO) => {
      return l.results.settings.symbols;
    };
    this.xAxis = 'generations size';
    const fields = Utils.Set.getUnique(this.logs.map(l => l.results.settings.field));
    this.names = fields;
    this.filteredLogs = fields.map(f => this.logs.filter(l => l.results.settings.field === f));
  }

  perField() {
    this.xFn = (l: LogDTO) => {
      const ret = l.results.settings.field.match(/\d+$/);
      if (ret) {
        return parseInt(ret[0], 10);
      }
      return 2;
    };
    this.xAxis = 'filed size';
    const symbols = Utils.Set.getUnique(this.logs.map(l => l.results.settings.symbols));
    this.names = symbols.map(v => 'generation size: ' + v);
    this.filteredLogs = symbols.map(s => this.logs.filter(l => l.results.settings.symbols === s));
  }


  renderSetupTime(): IPlotable[] {
    console.log('generating renderCounts');
    const plts = [];
    for (let i = 0; i < this.filteredLogs.length; i++) {
      let logs = this.filteredLogs[i];
      logs = logs.sort((a: LogDTO, b: LogDTO) => a.results.settings.symbols - b.results.settings.symbols);
      plts.push(Renderer.renderLine(
        {
          logs: logs,
          yFn: (l: LogDTO) => {
            const ds = DataStatisticUtils.fromArray(l.results.setupTime);
            return {value: ds.mean, error: ds.stdDev};
          },
          xFn: this.xFn,
          name: (l: LogDTO) => {
            return EnvionmentType[l.envionment.type] + '_' + l.lib.name;
          },
          titles: {
            x: this.xAxis,
            y: 'time [ms]',
            main: 'Setup time with ' + this.names[i] + ', symbols size: ' + logs[0].results.settings.symbol_size + ' byte'
          }
        }));
    }
    return plts.filter(plt => plt.data.length > 0);
  }


  renderMemoryUsage(): IPlotable[] {
    console.log('generating renderMemoryUsage');
    const plts = [];
    for (let i = 0; i < this.filteredLogs.length; i++) {
      let logs = this.filteredLogs[i];
      logs = logs.sort((a: LogDTO, b: LogDTO) => a.results.settings.symbols - b.results.settings.symbols);
      plts.push(Renderer.renderLine(
        {
          logs: logs,
          yFn: (l: LogDTO) => {
            const ds = DataStatisticUtils.fromArray(l.results.memory.browser.map(v => v / 1024 / 1024));
            return {value: ds.mean, error: ds.stdDev};
          },
          xFn: this.xFn,
          name: (l: LogDTO) => {
            return EnvionmentType[l.envionment.type] + '_' + l.lib.name;
          },
          titles: {
            x: this.xAxis,
            y: 'memory [MB]',
            main: 'Browser memory usage with ' + this.names[i] + ', symbols size: ' + logs[0].results.settings.symbol_size + ' byte'
          }
        }));
    }
    return plts.filter(plt => plt.data.length > 0);
  }

  renderLindDepencency(): IPlotable[] {
    console.log('generating renderLindDepencency');
    const plts = [];
    for (let i = 0; i < this.filteredLogs.length; i++) {
      let logs = this.filteredLogs[i];
      logs = logs.sort((a: LogDTO, b: LogDTO) => a.results.settings.symbols - b.results.settings.symbols);
      plts.push(Renderer.renderLine(
        {
          logs: logs,
          yFn: (l: LogDTO) => {
            const ds = DataStatisticUtils.fromArray(l.results.usedPackets.map((v, i) => v / l.results.settings.symbols));
            return {value: ds.mean, error: ds.stdDev};
          },
          xFn: this.xFn,
          name: (l: LogDTO) => {
            return EnvionmentType[l.envionment.type] + '_' + l.lib.name;
          },
          titles: {
            x: this.xAxis,
            y: 'used packets / symbols [ratio]',
            main: 'Liner dependent packages with ' + this.names[i] + ', symbols size: ' + logs[0].results.settings.symbol_size + ' byte'
          }
        }));
    }
    return plts.filter(plt => plt.data.length > 0);
  }

  renderKODOHeap(): IPlotable[] {
    console.log('generating renderKODOHeap');
    const plts = [];
    for (let i = 0; i < this.filteredLogs.length; i++) {
      let logs = this.filteredLogs[i];
      logs = logs.sort((a: LogDTO, b: LogDTO) => a.results.settings.symbols - b.results.settings.symbols);
      plts.push(Renderer.renderLine(
        {
          logs: logs,
          yFn: (l: LogDTO) => {
            const ds = DataStatisticUtils.fromArray(l.results.memory.kodoHeap.map(v => v / 1024 / 1024));
            return {value: ds.mean, error: ds.stdDev};
          },
          xFn: this.xFn,
          name: (l: LogDTO) => {
            return EnvionmentType[l.envionment.type] + '_' + l.lib.name;
          },
          titles: {
            x: this.xAxis,
            y: 'memory [MB]',
            main: 'Kodo Heap usage with ' + this.names[i] + ', symbols size: ' + logs[0].results.settings.symbol_size + ' byte'
          }
        }));
    }
    return plts.filter(plt => plt.data.length > 0);
  }


  renderDecodingRate(): IPlotable[] {
    console.log('generating renderDecodingRate');
    const plts: IPlotable[] = [];
    for (let i = 0; i < this.filteredLogs.length; i++) {
      let logs = this.filteredLogs[i];
      logs = logs.sort((a: LogDTO, b: LogDTO) => a.results.settings.symbols - b.results.settings.symbols);

      plts.push(Renderer.renderLine(
        {
          logs: logs,
          yFn: (l: LogDTO) => {
            const decodingSpeed = l.results.decodingTime.filter(v => v > 0).map((v, i) => l.results.decodedBytes[i] / 1024 / l.results.decodingTime[i]);
            const ds = DataStatisticUtils.fromArray(decodingSpeed);
            return {value: ds.mean, error: ds.stdDev};
          },
          xFn: this.xFn,
          name: (l: LogDTO) => {
            return EnvionmentType[l.envionment.type] + '_' + l.lib.name;
          },
          titles: {
            x: this.xAxis,
            y: 'Decoding rate [MB/s]',
            main: 'Decoding rate with ' + this.names[i] + ', symbols size: ' + logs[0].results.settings.symbol_size + ' byte'
          }
        }));
    }
    return plts.filter(plt => plt.data.length > 0);
  }

  renderEncodingRate(): IPlotable[] {
    console.log('generating renderDecodingRate');
    const plts = [];
    for (let i = 0; i < this.filteredLogs.length; i++) {
      let logs = this.filteredLogs[i];
      logs = logs.sort((a: LogDTO, b: LogDTO) => a.results.settings.symbols - b.results.settings.symbols);
      plts.push(Renderer.renderLine(
        {
          logs: logs,
          yFn: (l: LogDTO) => {
            const decodingSpeed = l.results.encodingTime.filter(v => v > 0).map((v, i) => l.results.encodedBytes[i] / 1024 / l.results.encodingTime[i]);
            const ds = DataStatisticUtils.fromArray(decodingSpeed);
            return {value: ds.mean, error: ds.stdDev};
          },
          xFn: this.xFn,
          name: (l: LogDTO) => {
            return EnvionmentType[l.envionment.type] + '_' + l.lib.name;
          },
          titles: {
            x: this.xAxis,
            y: 'Encoding rate [MB/s]',
            main: 'Encoding rate with ' + this.names[i] + ', symbols size: ' + logs[0].results.settings.symbol_size + ' byte'
          }
        }));
    }
    return plts.filter(plt => plt.data.length > 0);
  }

}
