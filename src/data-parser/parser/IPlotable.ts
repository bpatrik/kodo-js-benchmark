export interface IPlotData {
  x?: any[];
  y: number[];
  error_y?: {
    type: 'data',
    array: number[],
    visible: boolean,
    color?: string
  };
  groupName?: string;
  name: string;
  type: 'bar' | 'box' | 'scatter' | 'groupbox';
  boxmean?: boolean;
  order?: number;
  line?: {
    dash?: string;
    color?: string;
    width?: number;
  };
  marker?: {
    symbol?: string;
    color?: string;
    opacity?: number;
    size?: number;
  };
}

export interface IPlotable {
  data: IPlotData[];
  layout: {
    title: string;
    height?: number;
    width?: number;
    format?: 'png';
    barmode?: 'stack'
    xaxis?: {
      zeroline?: boolean;
      title?: string;
    };
    yaxis?: {
      range?: number[];
      zeroline?: boolean;
      title?: string;
      ticksuffix?: string;
      type?: 'log';
    };
  };
}
