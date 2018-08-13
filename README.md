# kodo-js-benchmark
This project is a small benchmark testbed for the (kodo-js)[https://github.com/steinwurf/kodo-js] lib

See benchmark results under the `results folder`.

## Usage:
#### 1) build your own libraries to benchmark 
The system needs the build libs to be placed under `/libs/<your_build>`
like:
```
libs/
|--59d0743_asm_o2/
   |--info.json
   |--kodo.js
   |--kodo.wasm
```
Where the content if the `info.json` should be lie this:
```json
{
  "name": "<your_build>",
  "type": 2,
  "flags":[
    "-O2",
    "--cxx_nodebug",
    "-s ALLOW_MEMORY_GROWTH=1"
  ]
}
```
and the lib main should be called `kodo.js`.
#### 2) install node modules and run
```bash
npm install
npm start
```
#### 3)  run benchmark
Open web browser at localhost:3000

#### 4) result will be under under `results/`


#### 5) plot data
1) run `node src/data-parser/parser/index.js` with the correct `*.jsonx` file
2) run `python src/data-parser/plotter/2d_plotter.py`
3) plots will be under `results/plots/` folder

## Docs:

The system has a node server and a browser based client part.
The server collects the benchmark results, the client runs the benchmark.


