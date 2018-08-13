import {BenchmarkResult} from '../frontend/benchmark/Benchmark';
import {LibInfoDTO} from './LibInfoDTO';

export enum EnvionmentType {
  Chrome = 1, Firefox = 2, Safari = 3, Opera = 4, IE = 5, NODE = 50, NA = 99,
}


export interface LogDTO {
  lib: LibInfoDTO;
  envionment: {
    type: EnvionmentType;
    version: string;
  };
  results: BenchmarkResult;
}
