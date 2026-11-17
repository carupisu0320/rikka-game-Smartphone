'use strict';
// node --check による構文チェック（js/*.js と server.js）
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs'), path = require('path'), cp = require('child_process');
const { ROOT } = require('./_sandbox');

const files = fs.readdirSync(path.join(ROOT, 'js')).filter(f => f.endsWith('.js')).map(f => 'js/' + f).concat(['server.js']);
for (const f of files) {
  test('構文: ' + f, () => {
    const r = cp.spawnSync(process.execPath, ['--check', path.join(ROOT, f)], { encoding: 'utf8' });
    assert.strictEqual(r.status, 0, r.stderr);
  });
}
