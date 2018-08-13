import json
import matplotlib
import matplotlib.pyplot as plt
from matplotlib import colors as mcolors
import glob
import os


def plot(filename):
  colors = dict(mcolors.BASE_COLORS, **mcolors.CSS4_COLORS)
  font = {'family': 'Times new roman',
          'size': 24}

  # matplotlib.rc('text', usetex=True)
  matplotlib.rc('font', **font)

  params = {'legend.fontsize': 22,
            'legend.labelspacing': 0.4}
  plt.rcParams.update(params)

  plt.figure(figsize=(16, 8))

  with open(filename) as data_file:
    data = json.load(data_file)

  for value in data['data']:
    marker = None
    linestyle = "-"
    linewidth = 4

    if 'line' in value and 'width' in value['line']:
      linewidth = value['line']['width']

    if 'line' in value and 'dash' in value['line']:
      if value['line']['dash'] == "longdash":
        linestyle = "--"
      if value['line']['dash'] == "solid":
        linestyle = "-"
      if value['line']['dash'] == "dot":
        linestyle = ":"
      if value['line']['dash'] == "dashdot":
        linestyle = "-."
      if value['line']['dash'] == "dash":
        linestyle = "--"

    if 'marker' in value and 'symbol' in value['marker']:
      if value['marker']['symbol'] == "circle":
        marker = "o"
      if value['marker']['symbol'] == "square":
        marker = "s"
      if value['marker']['symbol'] == "triangle-up":
        marker = "^"
    color = None
    ecolor = None
    if 'line' in value and 'color' in value['line']:
      color = value['line']['color']
      hsv = mcolors.rgb_to_hsv(mcolors.to_rgb(colors[color]))
      hsv[1] = max(hsv[1] - 0.6, 0)
      ecolor = mcolors.hsv_to_rgb(hsv)

    error_bars = None

    if 'error_y' in value:
      error_bars = value['error_y']['array']

      if 'arrayminus' in value['error_y']:
        error_bars = [value['error_y']['arrayminus'], value['error_y']['array']]

    plt.errorbar(value['x'],
                 value['y'],
                 yerr=error_bars,
                 color=color,
                 linewidth=linewidth,
                 linestyle=linestyle,
                 marker=marker,
                 markersize=8,
                 label=value['name'],
                 ecolor=ecolor,
                 elinewidth=2,
                 capsize=3)

    if all(isinstance(n, str) for n in value['x']):
      plt.xticks(rotation=25, horizontalalignment='right')

  plt.xlabel(data['layout']['xaxis']['title'])
  plt.ylabel(data['layout']['yaxis']['title'])
  plt.title(data['layout']['title'])

  if 'type' in data['layout']['yaxis'] and data['layout']['yaxis']['type'] == 'log':
    plt.yscale("log", nonposy='clip')

  lgd = plt.legend(loc=9, bbox_to_anchor=(0.5, -0.11), ncol=2)

  plt.grid(True)
  plt.subplots_adjust(left=0.06, right=0.995, top=0.94, bottom=0.25)
 # plt.tight_layout()
  plt.savefig(os.path.splitext(filename)[0]+ '.svg', format='svg', dpi=200, transparent=False,  bbox_extra_artists=(lgd,), bbox_inches='tight')
  plt.close()
  # plt.show()


files = glob.glob("./../../../results/plots/**/**/*.json")
for index, filename in enumerate(files):
  print(index, '/', len(files), filename)
  plot(filename)

