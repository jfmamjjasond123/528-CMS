import * as migration_20250523_080359 from './20250523_080359';
import * as migration_20250528_122406 from './20250528_122406';

export const migrations = [
  {
    up: migration_20250523_080359.up,
    down: migration_20250523_080359.down,
    name: '20250523_080359',
  },
  {
    up: migration_20250528_122406.up,
    down: migration_20250528_122406.down,
    name: '20250528_122406'
  },
];
