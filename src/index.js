#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';

function printUsage() {
  console.log('npm-link-copy <linked-module>');
}

function copyModule(source, destination) {
  fs.copy(source, destination);
  console.log(source, '->', destination);
}

function run() {
  if (!process.argv[2] || process.argv[2] === '-h' || process.argv[2] === '--help') {
    printUsage();
    return;
  }

  const cwd = process.cwd();
  const moduleSource = path.resolve(cwd, process.argv[2]);

  const modulePackage = fs.readJSONSync(path.join(moduleSource, 'package.json'));
  const moduleDestination = path.resolve(cwd, 'node_modules', modulePackage.name);

  copyModule(moduleSource, moduleDestination);

  fs.watch(moduleSource, {
    persistent: true,
    recursive: true,
  }, (/* event, filename */) => {
    // TODO: copy only changed files.
    copyModule(moduleSource, moduleDestination);
  });
}

run();
