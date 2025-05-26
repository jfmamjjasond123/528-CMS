import * as migration_20250523_080359 from './20250523_080359';

export const migrations = [
  {
    up: migration_20250523_080359.up,
    down: migration_20250523_080359.down,
    name: '20250523_080359'
  },
];
