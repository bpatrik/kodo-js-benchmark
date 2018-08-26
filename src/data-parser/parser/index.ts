import {DataLoader} from './DataLoader';
import {Plotter} from './Plotter';
import * as path from 'path';
import {ProjectPath} from '../../backend/ProjectPath';
import {PlotsGenerator} from './PlotsGenerator';

const results = DataLoader.loadFolder().filter(r=>r.lib.name.indexOf('nodebug') !== -1);


const plotsGenerator = new PlotsGenerator(results);
const baseDir = path.join(ProjectPath.LogFolder, 'plots');


const plotAllToJSON = async (rendered, subPath) => {
  const waitAll = [];
  for (let i = 0; i < rendered.length; i++) {
    waitAll.push(Plotter.toJSON(rendered[i], path.join(baseDir, subPath)));
  }
  for (let i = 0; i < waitAll.length; i++) {
    await waitAll[i];
  }
};


const run = async () => {
  plotsGenerator.perSymbols();
  await plotAllToJSON(plotsGenerator.renderSetupTime(), path.join('setup_time', 'per_generation_size'));
  await plotAllToJSON(plotsGenerator.renderDecodingRate(), path.join('decoding_rate', 'per_generation_size'));
  await plotAllToJSON(plotsGenerator.renderEncodingRate(), path.join('encoding_rate', 'per_generation_size'));
  await plotAllToJSON(plotsGenerator.renderLindDependency(), path.join('lin_dependency', 'per_generation_size'));
//  await plotAllToJSON(plotsGenerator.renderMemoryUsage(), path.join('memory_usage', 'per_generation_size'));
//  await plotAllToJSON(plotsGenerator.renderKODOHeap(), path.join('kodo_heap', 'per_generation_size'));
  plotsGenerator.perField();
  await plotAllToJSON(plotsGenerator.renderSetupTime(), path.join('setup_time', 'per_field'));
  await plotAllToJSON(plotsGenerator.renderDecodingRate(), path.join('decoding_rate', 'per_field'));
  await plotAllToJSON(plotsGenerator.renderEncodingRate(), path.join('encoding_rate', 'per_field'));
  await plotAllToJSON(plotsGenerator.renderLindDependency(), path.join('lin_dependency', 'per_field'));
 // await plotAllToJSON(plotsGenerator.renderMemoryUsage(), path.join('memory_usage', 'per_field'));
 // await plotAllToJSON(plotsGenerator.renderKODOHeap(), path.join('kodo_heap', 'per_field'));
};

run();
