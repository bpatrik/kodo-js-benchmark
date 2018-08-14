import * as _express from 'express';
import {Express, NextFunction, Request, Response} from 'express';
import * as _bodyParser from 'body-parser';
import * as _http from 'http';
import {LogDTO} from '../common/LogDTO';
import {LibInfoDTO} from '../common/LibInfoDTO';
import * as fs from 'fs';
import * as path from 'path';
import {ProjectPath} from './ProjectPath';
import {StatisticFileLogger} from './model/StatisticFileLogger';

const LOG_TAG = '[server]';


export class Server {
  public static PORT = 3000;

  private app: Express;
  private server: any;

  constructor() {
    this.init();
  }

  async init() {

    this.app = _express();

    _express.static.mime.define({'application/wasm': ['wasm']});
    /**
     * Parse parameters in POST
     */
    // for parsing application/json
    this.app.use(_bodyParser.urlencoded({limit: '50mb', extended: true}));
    this.app.use(_bodyParser.json({limit: '50mb'}));

    this.app.use('/', _express.static(ProjectPath.FrontendFolder, {maxAge: 31536000}));
    this.app.use('/node_modules', _express.static(ProjectPath.NodeModulesFolder));
    this.app.use('/common', _express.static(ProjectPath.CommonFolder));
    this.app.use('/libs', _express.static(ProjectPath.LibsFolder));

    this.app.get('/api/libs', (req: Request, res: Response, next: NextFunction) => {
      const isDirectory = s => fs.lstatSync(s).isDirectory();
      const list: LibInfoDTO[] = fs.readdirSync(ProjectPath.LibsFolder).map(name => path.join(ProjectPath.LibsFolder, name)).filter(isDirectory).map(s => {
        return require(s + '/info.json');
      });
      return res.send(list.filter(l => l.name.indexOf('9218964') != -1));
    });

    const fileLogger = new StatisticFileLogger();

    this.app.post('/api/log', (req: Request, res: Response, next: NextFunction) => {
      const log = <LogDTO>req.body;

      fileLogger.log(log);

      res.send('ok');
    });


    // Get PORT from environment and store in Express.
    this.app.set('port', Server.PORT);

    // Create HTTP server.
    this.server = _http.createServer(this.app);

    // Listen on provided PORT, on all network interfaces.
    this.server.listen(Server.PORT);
    this.server.on('error', this.onError(Server.PORT));
    this.server.on('listening', this.onListening(this.server));


  }


  /**
   * Event listener for HTTP server "error" event.
   */
  private onError = (port: number) => {
    return (error: any) => {
      if (error.syscall !== 'listen') {
        console.error(LOG_TAG, 'Server error', error);
        throw error;
      }

      // handle specific listen error with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error('Privileges Error:');
          console.error(LOG_TAG, port + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error('Port Error:');
          console.error(LOG_TAG, port + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    };
  };


  /**
   * Event listener for HTTP server "listening" event.
   */
  private onListening = (server) => {
    return () => {
      const addr = server.address();
      const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      console.info(LOG_TAG, 'Listening on ' + bind);
    };
  };


}


