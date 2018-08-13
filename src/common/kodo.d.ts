type em_string_type = ArrayBufferLike | Uint8Array | Uint8ClampedArray | Int8Array | string;

declare module KODO {
  const HEAP8: Int8Array;

  enum field {
    binary, binary4, binary8, binary16
  }

  interface Koder {
    write_payload(): string;

    payload_size(): number;

    block_size(): number;

    symbol_size(): number;

    symbols(): number;

    rank(): number;


    is_symbol_pivot(index: number): boolean;

    coefficient_vector_size(): number;

    delete();

  }

  interface Encoder extends KODO.Koder {

    write_symbol(coefficients: em_string_type): string;

    is_systematic_on(): boolean;

    set_systematic_off();

    set_systematic_on();

    generate(): string;

    set_const_symbols(data: em_string_type);

    set_const_symbol(index: number, data: em_string_type);

  }

  interface Decoder extends KODO.Koder {
    is_complete(): boolean;

    symbols_uncoded(): number;

    copy_from_symbols(): string;

    is_symbol_uncoded(index: number): boolean;

    read_payload(payload: em_string_type);

    read_symbol(payload: em_string_type, coefficients: em_string_type);

    symbols_partially_decoded(): number;

  }

  interface encoder_factory {
    new(field: field, symbols: number, symbol_size: number);

    build(): Encoder;

    delete();
  }

  interface decoder_factory {
    new(field: field, symbols: number, symbol_size: number);

    build(): Decoder;

    delete();
  }
}
