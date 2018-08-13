type LibFlags = '-O2' | '--cxx_nodebug' | '-s ALLOW_MEMORY_GROWTH=1';

export enum CompilationType {
  ASM = 1, WASM = 2
}

export interface LibInfoDTO {
  name: string;
  type: CompilationType,
  flags: LibFlags[];
}
