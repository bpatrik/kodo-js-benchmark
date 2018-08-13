import {EnvionmentType} from '../common/LogDTO';


export const browserType = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) ? EnvionmentType.Firefox :
  (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) ? EnvionmentType.Chrome :
    (navigator.userAgent.toLowerCase().indexOf('safari') > -1) ? EnvionmentType.Safari :
      (navigator.userAgent.toLowerCase().indexOf('opera') > -1 ||  navigator.userAgent.toLowerCase().indexOf('opr') > -1) ? EnvionmentType.Opera :
        (navigator.userAgent.toLowerCase().indexOf('msie') > -1) ? EnvionmentType.IE : EnvionmentType.NA;
