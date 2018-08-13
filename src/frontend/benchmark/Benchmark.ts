///<reference path="../../common/kodo.d.ts"/>


// Based on  Steinwurf's kodo-js benchmark
// http://www.steinwurf.com


declare const KODO: any;

export interface BenchmarkResult<T = number[]> {
  encodedBytes: T;
  decodedBytes: T;
  decodingTime: T;
  encodingTime: T;
  setupTime: T;
  usedPackets: T;
  memory: {
    browser: T;
    kodoHeap: T;
  };
  rounds: number;
  settings: {
    field: string;
    symbols: number;
    symbol_size: number;
  }
}

export class Benchmark {


  static rounds = 1000;

  constructor(public field: string, public symbols: number, public symbol_size: number) {
    if (!KODO.field[this.field]) {
      throw new Error('invalid filed: ' + this.field + ', available: ' + Object.keys(KODO.field));

    }
  }


  static randomString(length) {
    let s = '';

    const random_char = () => {
      let n = Math.floor(Math.random() * 62);
      if (n < 10) return n; //1-10
      if (n < 36) return String.fromCharCode(n + 55); //A-Z
      return String.fromCharCode(n + 61); //a-z
    };

    while (s.length < length) s += random_char();
    return s;
  }


  runATest() {
    const start_setup = window.performance.now();


    const encoder_factory = new KODO.encoder_factory(KODO.field[this.field], this.symbols, this.symbol_size);
    const encoder = encoder_factory.build();

    const decoder_factory = new KODO.decoder_factory(KODO.field[this.field], this.symbols, this.symbol_size);
    const decoder = decoder_factory.build();

    const setup_time = window.performance.now() - start_setup;

    // Create some random data
    const data_in = Benchmark.randomString(encoder.block_size());

    // Assign the data buffer to the encoder so that we can
    // produce encoded symbols
    encoder.set_const_symbols(data_in);

    // We measure pure coding, so we always turn off the systematic mode
    encoder.set_systematic_off();

    const payloads: string[] = [];
    let payload_count = Math.max(2 * Math.max(this.symbols, 8), 10);
    if (KODO.field[this.field] === KODO.field.binary) {
      payload_count *= 2;
    }

    const start_encoding = window.performance.now();

    for (let i = 0; i < payload_count; i++) {
      const payload = encoder.write_payload();
      payloads.push(payload);
    }

    const encoding_time = window.performance.now() - start_encoding;

    // Calculate the encoding rate in megabytes / seconds
    const encoded_bytes = payload_count * this.symbol_size;
    //  const encoding_rate = encodedBytes / encodingTime;

    const start_decoding = window.performance.now();
    let used_packets = 0;

    for (used_packets = 0; used_packets < payload_count; used_packets++) {
      if (decoder.is_complete()) {
        break;
      }
      decoder.read_payload(payloads[used_packets]);
    }

    const data_out = decoder.copy_from_symbols();
    const decoding_time = window.performance.now() - start_decoding;

    if (!decoder.is_complete()) {
      throw new Error('Could not decode, rank:' + decoder.rank() + ' with packets: ' + used_packets);
    }


    // Calculate the decoding rate in megabytes / seconds
    const decoded_bytes = this.symbols * this.symbol_size;
    // const decoding_rate = decodedBytes / decodingTime;
    if (data_out !== data_in) {
      console.log('data_in', data_in.length, data_in.substring(0, 100) + '...');
      console.log('data_out', data_out.length, data_out.substring(0, 100) + '...');
      throw new Error('Decoding failed! we used ' + used_packets + ' packets, decoder rank: ' + decoder.rank() + '/' + this.symbols);
    }
    decoder.delete();
    encoder.delete();

    encoder_factory.delete();
    decoder_factory.delete();

    const memory = window.performance['memory'] ? window.performance['memory'].usedJSHeapSize : null;

    return <BenchmarkResult<number>>{
      encodedBytes: encoded_bytes,
      decodedBytes: decoded_bytes,
      decodingTime: decoding_time,
      encodingTime: encoding_time,
      usedPackets: used_packets,
      setupTime: setup_time,
      memory: {
        browser: memory,
        kodoHeap: KODO.HEAP8.length
      }
    };
  }

  run(): BenchmarkResult {

    const stat: BenchmarkResult = {
      encodedBytes: [],
      decodedBytes: [],
      decodingTime: [],
      encodingTime: [],
      setupTime: [],
      usedPackets: [],
      memory: {
        browser: [],
        kodoHeap: []
      },
      rounds: Benchmark.rounds,
      settings: {
        field: this.field,
        symbol_size: this.symbol_size,
        symbols: this.symbols
      }
    };

    for (let i = 0; i < Benchmark.rounds; i++) {
      const tmp = this.runATest();
      stat.encodedBytes.push(tmp.encodedBytes);
      stat.decodedBytes.push(tmp.decodedBytes);
      stat.encodingTime.push(tmp.encodingTime);
      stat.decodingTime.push(tmp.decodingTime);
      stat.usedPackets.push(tmp.usedPackets);
      stat.setupTime.push(tmp.setupTime);
      stat.memory.browser.push(tmp.memory.browser);
      stat.memory.kodoHeap.push(tmp.memory.kodoHeap);
    }


    return stat;

  }
}

