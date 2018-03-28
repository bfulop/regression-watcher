# Changes watcher for regression server

![Anybar feedback](https://5a53e939e8f0862e6153-623c55fb68acb92f1f433c6448bed244.ssl.cf3.rackcdn.com/github/regression-watch/anybar.gif)

Watches a file or folder (typically the CSS files), notifies the [regression server](https://github.com/bfulop/regression-server), and displays the results in the terminal.

## Usage

`$ node src/index watch=[path/to/your/CSS.file] server=[adress of regression server]`

Needs two paramters, otherwise the app won't start

`watch=[path]` : the file path to your folder or file relative to your (`os.home`) home directory

`server=[server address]` the address of your regression server (`localhost`, etc)

### Work in progress, roadmap

So this is a very minimal implementation, with the most basic feedback display (in the terminal).

#### Add Anybar display

I'm planning to some day connect this to [Anybar](https://github.com/tonsky/AnyBar) to have the results displayed in Mac OS menubar.

#### Web display

Display the results in a webpage, and show the diffs as image. It would display the reference capture overlayed with the latest capture.