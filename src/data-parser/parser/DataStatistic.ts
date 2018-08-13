export interface DataStatistic {
  min: number;
  max: number;
  mean: number;
  median: number;
  mode: number;
  variance: number;
  stdDev: number;
  count: number;
  rawData: Array<number> | any;
}

export interface ContinuousDataStatistic extends DataStatistic {
  continuousMean: number;
}


export class DataStatisticUtils {
  private static median(soredValues: Array<number>): number {
    const middle = Math.floor(soredValues.length / 2);
    const isEven = soredValues.length % 2 === 0;
    return isEven ? (soredValues[middle] + soredValues[middle - 1]) / 2 : soredValues[middle];
  }

  private static mean(soredValues: Array<number>): number {
    return soredValues.reduce((prev, current) => prev + current, 0) / soredValues.length;
  }

  private static mode(soredValues: Array<number>): number {
    let best = {value: null, occurrence: 0};
    let current = {value: null, occurrence: 0};
    for (let i = 0; i < soredValues.length; i++) {
      if (current.value !== soredValues[i]) {
        if (best.occurrence < current.occurrence) {
          best = current;
        }
        current = {value: soredValues[i], occurrence: 0};
      }
      current.occurrence++;
    }

    if (best.occurrence < current.occurrence) {
      best = current;
    }

    return best.value;
  }

  private static variance(mean: number, soredValues: Array<number>): number {

    let variance = 0;
    for (let i = 0; i < soredValues.length; i++) {
      variance += (soredValues[i] - mean) * (soredValues[i] - mean);
    }

    variance /= soredValues.length;

    return variance;
  }

  public static fromArray(values: Array<number>): DataStatistic {
    if (values.length === 0) {
      return <DataStatistic>{
        min: 0,
        max: 0,
        mean: 0,
        median: 0,
        mode: 0,
        variance: 0,
        stdDev: 0,
        count: 0,
        rawData: []
      };
    }

    const originalValues = values.slice();
    values = values.slice().filter(v => !isNaN(v)).sort((a, b) => a - b);

    const mean = this.mean(values);
    const variance = this.variance(mean, values);

    return <DataStatistic>{
      min: values[0],
      max: values[values.length - 1],
      mean: mean,
      median: this.median(values),
      mode: this.mode(values),
      variance: variance,
      stdDev: Math.sqrt(variance),
      count: values.length,
      rawData: originalValues
    };
  }
}
