///<reference path="./../common/kodo.d.ts"/>


import {LibInfoDTO} from '../common/LibInfoDTO';
import {Benchmark} from './benchmark/Benchmark';
import {LogDTO} from '../common/LogDTO';
import {browserType} from './Browser';
import {URL} from './URL';


declare let KODO: any;

const getLibs = (): Promise<LibInfoDTO[]> => {
  return new Promise((resolve, reject) => {
    try {
      $.ajax('/api/libs', {
        type: 'GET',
        contentType: 'application/json',
      }).done((data) => {
        resolve(data);
      }).fail((err) => {
        console.error('Failed loading lib list');
        console.error(err);
      });
    }
    catch (err) {
      console.error('Failed loading lib list');
      console.error(err);
    }
  });
};

const loadKodo = (info: LibInfoDTO) => {
  return new Promise((resolve, reject) => {
    console.log('loading');

    window['Module'] = window['Module'] || {};
    window['Module']['memoryInitializerPrefixURL'] = '/libs/' + info.name;
    const script = document.createElement('script');
    script.type = 'text/javascript';


    if (script['readyState']) {  //IE
      script['onreadystatechange'] = function () {
        if (script['readyState'] == 'loaded' ||
          script['readyState'] == 'complete') {
          script['onreadystatechange'] = null;
          resolve();
        }
      };
    } else {  //Others
      script.onload = function () {
        window['KODO'] = window['Module'];
        if (window['KODO']['field']) {
          console.log('loaded');
          return resolve();
        }
        window['Module'].onRuntimeInitialized = () => {
          console.log('loaded');
          return resolve();
        };
      };
    }

    script.src = '/libs/' + info.name + '/kodo.js';
    document.getElementsByTagName('head')[0].appendChild(script);
  });
};


const sendStat = (log: LogDTO) => {
  return new Promise(async (resolve, reject) => {
    try {
      $.ajax('/api/log', <JQueryAjaxSettings>{
        type: 'POST',
        data: JSON.stringify(log),
        contentType: 'application/json',
      }).done((data) => {
        resolve(data);
      }).fail((err) => {
        console.error('Failed sending error');
        console.error(err);
      });
    } catch (err) {
      console.error('Failed sending error');
      console.error(err);
    }
  });
};

window['run'] = async () => {
  try {
    const libs = await getLibs();
    const symbol_size = 1024;
    const lib = URL.getURLParameter('lib');
    const field = URL.getURLParameter('field');
    const symbols = parseInt(URL.getURLParameter('symbols'), 10);

    const libInfo = libs.filter(l => l.name === lib)[0];

    await loadKodo(libInfo);

    const bm = new Benchmark(field, symbols, symbol_size, libInfo.withMemoryView);
    const res = bm.run();
    const log: LogDTO = {
      envionment: {type: browserType, version: navigator.appVersion},
      lib: libInfo,
      results: res
    };
    await sendStat(log);
  } catch (e) {
    console.error(e);
    throw e;
  }


};


window.parent['onIframeReady']();
