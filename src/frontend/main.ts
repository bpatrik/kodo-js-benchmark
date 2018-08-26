import {TaskScheduler} from '../common/TaskScheduler';
import {LibInfoDTO} from '../common/LibInfoDTO';

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

const timeoutTask = new TaskScheduler();

const runMeasurement = async (libInfo: LibInfoDTO, field, symbols) => {

  return new Promise((resolve, reject) => {
    timeoutTask.schedule(() => {
      $('iframe').remove();
      reject('timeout');
    }, 5 * 60 * 1000);
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    window['onIframeReady'] = () => {
      iframe.contentWindow['run']().then(() => {
        timeoutTask.clear();
        $('iframe').remove();
        resolve();
      }).catch((err) => {
        timeoutTask.clear();
        $('iframe').remove();
        reject(err);
      });
    };
    iframe.src = '/measure.html?lib=' + libInfo.name + '&field=' + field + '&symbols=' + symbols;
    document.body.appendChild(iframe);
  });
};

const setStatus = (str) => {
  console.log(str);
  $('#status').html(str);
};
const addError = (str) => {
  console.log(str);
  $('#error').append($('<div>').html(str));
};

const run = async () => {
  const libs = await getLibs();
  console.log('libs:');
  console.log(libs);


  const start = window.performance.now();
 // const fields = ['binary', 'binary4', 'binary8', 'binary16'];
  const fields = ['binary8'];

  const symbols = [2, 4, 8, 16, 32, 64];


  for (let i = 0; i < libs.length; i++) {

    for (let j = 0; j < fields.length; j++) {
      for (let k = 0; k < symbols.length; k++) {
        const d = window.performance.now() - start;
        const all = (libs.length * fields.length * symbols.length);
        const done = (i * fields.length * symbols.length + j * symbols.length + k);
        setStatus('running: ' + libs[i].name + ', ' + fields[j] + ' with ' + symbols[k] + ' symbols ' +
          '(' + done + '/' + all + ') ellapsed.:' + (d / 1000).toFixed(0) + 's, left: ' + (d / done * (all-done) / 1000).toFixed(0) + 's');
        try {
          await runMeasurement(libs[i], fields[j], symbols[k]);
        } catch (err) {
          console.error(err);
          addError('Error: "' + err.toString() + '"');
        }
      }
    }

  }
  setStatus('Done in: ' + ((window.performance.now() - start)/1000) + 's');


};

run().catch((err) => {
  console.error(err);
  setStatus('Error: "' + err.toString() + '"');
});
