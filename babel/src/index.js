import { promises } from 'fs';

export class MyClass {
  readFile(...path) {
    return Promise.any(paths.map((p) => promises.readFile(p, 'utf8')));
  }
}
