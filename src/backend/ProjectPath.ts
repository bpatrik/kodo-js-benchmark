import * as path from 'path';

class ProjectPathClass {
  public Root: string;
  public SourceFolder: string;
  public FrontendFolder: string;
  public CommonFolder: string;
  public LibsFolder: string;
  public NodeModulesFolder: string;
  public LogFolder: string;

  constructor() {
    this.reset();
  }

  reset() {
    this.Root = path.join(__dirname, '/../../');
    this.SourceFolder = path.join(this.Root, '/src');
    this.FrontendFolder = path.join(this.SourceFolder, '/frontend');
    this.CommonFolder = path.join(this.SourceFolder, '/common');
    this.LibsFolder = path.join(this.Root, '/libs');
    this.NodeModulesFolder = path.join(this.Root, '/node_modules');
    this.LogFolder = path.join(this.Root, '/results');
  }
}

export const ProjectPath = new ProjectPathClass();
