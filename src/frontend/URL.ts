export class URL {
  static getURLParameter(sParam): string {
    const sPageURL = window.location.search.substring(1);
    const sURLletiables = sPageURL.split('&');
    for (let i = 0; i < sURLletiables.length; i++) {
      const sParameterName = sURLletiables[i].split('=');
      if (sParameterName[0] === sParam) {
        return sParameterName[1];
      }
    }
    return null;
  }

  static addParameter(url: string, param: string, value) {
    const hash = {};
    const parser = document.createElement('a');

    parser.href = url;

    const parameters = parser.search.split(/\?|&/);

    for (let i = 0; i < parameters.length; i++) {
      if (!parameters[i]) {
        continue;
      }
      const ary = parameters[i].split('=');
      hash[ary[0]] = ary[1];
    }

    hash[param] = value;

    const list = [];
    Object.keys(hash).forEach(function (key) {
      list.push(key + '=' + hash[key]);
    });

    parser.search = '?' + list.join('&');
    return parser.href;
  }
}
