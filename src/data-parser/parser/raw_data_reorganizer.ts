import {DataLoader} from './DataLoader';
import {Utils} from '../../common/Utils';
import * as fs from 'fs';
import * as path from 'path';
import {ProjectPath} from '../../backend/ProjectPath';
import {EnvionmentType} from '../../common/LogDTO';

const results = DataLoader.loadResult('log_20180826-162450.jsonx');
const types = Utils.Set.getUnique(results.map(r => r.lib.name));
const browsers = [EnvionmentType.Chrome, EnvionmentType.Firefox];
for (let i = 0; i < types.length; i++) {
  for (let j = 0; j < browsers.length; j++) {
    const filtered = results.filter(r => r.lib.name === types[i] && r.envionment.type === browsers[j]);
    if (filtered.length == 0) {
      continue;
    }
    const rawData = JSON.stringify(filtered);

    const data = rawData.substring(1, rawData.length - 1);

    fs.writeFileSync(path.join(ProjectPath.LogFolder, 'result_' + EnvionmentType[browsers[j]] + '_' + types[i] + '.jsonx'), data, 'utf8');
  }
}

