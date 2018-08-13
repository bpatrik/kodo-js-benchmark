export class Utils {

  static GUID() {
    const s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

    return s4() + s4();
  }

  /**
   * Shuffles array in place.
   * @param {Array} a items An array containing the items.
   */
  static shuffle<T>(a: T[]): T[] {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  static findDataCount(amount: number): { postFix: string, divider: number } {
    const postFIX = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

    let exponent = Math.floor(Math.log(amount) / Math.log(1024));


    if (amount / Math.pow(1024, exponent) < 1) {
      exponent--;
    }

    if (exponent >= postFIX.length) {
      exponent = postFIX.length - 1;
    }
    if (exponent <= 0) {
      exponent = 0;
    }

    if ((amount / Math.pow(1024, exponent + 1)) % 1 === 0) {
      exponent++;
    }

    return {
      postFix: postFIX[exponent],
      divider: Math.pow(1024, exponent),
    };
  }

  static renderDataCount(amount: number): string {
    const postFIX = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

    let exponent = Math.floor(Math.log(amount) / Math.log(1024));


    if (amount / Math.pow(1024, exponent) < 10) {
      exponent--;
    }

    if (exponent >= postFIX.length) {
      exponent = postFIX.length - 1;
    }
    if (exponent <= 0) {
      exponent = 0;
    }

    if ((amount / Math.pow(1024, exponent + 1)) % 1 === 0) {
      exponent++;
    }
    const toStr = (exp): string => {
      const value = amount / Math.pow(1024, exp);
      let ret: string = value.toString();
      if (value % 1 === 0) {
        ret = (amount / Math.pow(1024, exp)).toFixed(0);
      } else if (value < 100) {
        ret = (amount / Math.pow(1024, exp)).toFixed(2);
      } else {
        ret = (amount / Math.pow(1024, exp)).toFixed(1);
      }
      return ret;
    };

    let valueStr = toStr(exponent);
    if (toStr(exponent + 1).length < valueStr.length) {
      exponent++;
      valueStr = toStr(exponent);
    }

    return valueStr + ' ' + postFIX[exponent];
  }


  static intToTime(millieSeconds: number) {
    const date = new Date(millieSeconds);
    const hours = date.getHours();
    const minutes = '0' + date.getMinutes();
    const seconds = '0' + date.getSeconds();

    return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  }

  static intToHHMMSS(millieSeconds: number) {
    const sec_num = millieSeconds / 1000;
    const hours: number = Math.floor(sec_num / 3600);
    const minutes: number = Math.floor((sec_num - (hours * 3600)) / 60);
    const seconds: number = Math.round(sec_num - (hours * 3600) - (minutes * 60));

    let hoursString: string = hours.toString();
    let minutesString: string = minutes.toString();
    let secondsString: string = seconds.toString();
    if (hours < 10) {
      hoursString = '0' + hours;
    }
    if (minutes < 10) {
      minutesString = '0' + minutes;
    }
    if (seconds < 10) {
      secondsString = '0' + seconds;
    }

    return hoursString + ':' + minutesString + ':' + secondsString;
  }

  static intToMMSS(millieSeconds: number): string {
    const sec_num = millieSeconds / 1000;
    const minutes: number = Math.floor(sec_num / 60);
    const seconds: number = Math.round(sec_num - (minutes * 60));

    let minutesString: string = minutes.toString();
    let secondsString: string = seconds.toString();

    if (minutes < 10) {
      minutesString = '0' + minutes;
    }
    if (seconds < 10) {
      secondsString = '0' + seconds;
    }

    return minutesString + ':' + secondsString;
  }

  static intToSSMS(millieSeconds: number): string {
    const sec_num = millieSeconds / 1000;
    const seconds: number = Math.floor(sec_num);
    const millis: number = Math.round(millieSeconds % 1000);

    let secondsString: string = seconds.toString();
    let millisString: string = millis.toString();


    if (seconds < 10) {
      secondsString = '0' + seconds.toString();
    }
    if (millis < 100) {
      millisString = '0' + millis.toString();
    }
    if (millis < 10) {
      millisString = '00' + millis.toString();
    }


    return secondsString + '.' + millisString;
  }


  static shuffleArray<T>(o: Array<T>): Array<T> {
    //noinspection StatementWithEmptyBodyJS
    let j, x, i = o.length;
    for (; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {
    }
    return o;
  }

  /**
   *
   * @param from inclusive
   * @param to inclusive
   * @returns {number}
   */
  static randomInteger(from: number, to: number): number {
    return Math.floor(Math.random() * ((to + 1) - from)) + from;
  }

  /**
   *
   * @param from
   * @param to inclusive
   * @returns {Array}
   */
  static createRange(from: number, to: number): Array<number> {
    const arr = new Array(to - from + 1);
    let c = to - from + 1;
    while (c--) {
      arr[c] = to--;
    }
    return arr;
  }


  static createArray<T>(length: number, value: T): Array<T> {
    const arr: Array<T> = [];
    for (let i = 0; i < length; i++) {
      arr.push(value);
    }
    return arr;
  }

  static ObjectToArray(dataObject: any): Array<any> {
    const dataArray = [];
    for (const key in dataObject) {
      if (!dataObject.hasOwnProperty(key)) {
        continue;
      }
      dataArray.push(dataObject[key]);
    }
    return dataArray;
  }

  static str2ab(s: string): ArrayBuffer {
    const buf = new ArrayBuffer(s.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = s.length; i < strLen; ++i) {
      bufView[i] = s.charCodeAt(i);
    }
    return buf;
  }

  static clone<T>(object: T): T {
    return JSON.parse(JSON.stringify(object));
  }

  static extend<T, S>(object: T, extension: S): T {
    const cloned = JSON.parse(JSON.stringify(object));
    for (const key of Object.keys(extension)) {
      cloned[key] = extension[key];
    }
    return cloned;
  }


  static stringifyVariables(object: any) {
    object = Utils.clone(object);

    if (Utils.IsNumeric(object)) {
      return object.toString();
    }


    for (const key in object) {
      if (!object.hasOwnProperty(key)) {
        continue;
      }
      if (object[key] == null) {
        continue;
      }
      if (Array.isArray(object[key])) {
        for (const innerKey in object[key]) {
          if (!object[key].hasOwnProperty(innerKey)) {
            continue;
          }
          object[key][innerKey] = Utils.stringifyVariables(object[key][innerKey]);
        }
        continue;
      }
      if (typeof object[key] === 'object') {
        object[key] = Utils.stringifyVariables(object[key]);
        continue;
      }
      if (Utils.IsNumeric(object[key])) {
        object[key] = object[key].toString();
      }
    }
    return object;
  }

  static zeroPrefix(value, length: number) {
    const ret = '00000' + value;
    return ret.substr(ret.length - length);
  }

  static removeNulls(object: any) {
    object = Utils.clone(object);


    for (const key in object) {
      if (!object.hasOwnProperty(key)) {
        continue;
      }
      if (object[key] == null) {
        delete object[key];
      }
      if (typeof object[key] === 'object') {
        object[key] = Utils.removeNulls(object[key]);
      }
    }
    return object;
  }

  public static simpleNumber(value: number): string {
    if (Utils.IsNumeric(value) && !Utils.IsInt(value) && typeof value !== 'string') {
      if (value > 0) {
        if (value > 100) {
          return value.toFixed(1);
        } else {
          return value.toFixed(2);
        }
      } else {
        return value.toPrecision(2);
      }
    }
    return <any>value;
  }

  public static IsNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  static IsInt(n) {
    return Number(n) === n && n % 1 === 0;
  }

  static IsFloat(n) {
    return Number(n) === n && n % 1 !== 0;
  }

  static cleanUpObject(object: any) {
    if (object && object != null && object.cleanUp) {
      object.cleanUp();
    }
  }


  public static updateObject(targetObject, sourceObject) {
    for (const key in sourceObject) {
      if (!sourceObject.hasOwnProperty(key) || !targetObject.hasOwnProperty(key)) {
        continue;
      }

      if (Array.isArray(targetObject[key])) {
        targetObject[key] = sourceObject[key];
        continue;
      }

      if (typeof targetObject[key] === 'object') {
        this.updateObject(targetObject[key], sourceObject[key]);
        continue;
      }

      targetObject[key] = sourceObject[key];
    }
  }


  public static findFirstDiffPos(a: string, b: string): number {
    const longerLength = Math.max(a.length, b.length);
    for (let i = 0; i < longerLength; i++) {
      if (a[i] !== b[i]) {
        return i;
      }
    }

    return -1;
  }

  public static max(...arr: number[][]): number {
    let max = Number.MIN_SAFE_INTEGER;
    for (let i = 0; i < arr.length; ++i) {
      max = Math.max(max, Math.max.apply(Math, arr[i]));
    }
    return max;
  }

  public static min(...arr: number[][]): number {
    let min = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < arr.length; ++i) {
      min = Math.min(min, Math.min.apply(Math, arr[i]));
    }
    return min;
  }


}

export module Utils {
  export class Set<T> {
    elements: T[] = [];

    public static getUnique<T>(list: T[]): T[] {
      return list.filter(function (value, index, self) {
        return self.indexOf(value) === index;
      });
    }

    add(element: T): Set<T> {
      if (this.elements.indexOf(element) !== -1) {
        return;
      }
      this.elements.push(element);
      return this;
    }

    addAll(elements: T[]): Set<T> {
      elements.forEach(e => this.add(e));
      return this;
    }

    toArray(): T[] {
      return this.elements;
    }


  }
}
