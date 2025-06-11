import * as migration_20250602_052116 from './20250602_052116';
import * as migration_20250609_050511 from './20250609_050511';
import * as migration_20250610_054934 from './20250610_054934';
import * as migration_20250611_093329 from './20250611_093329';

export const migrations = [
  {
    up: migration_20250602_052116.up,
    down: migration_20250602_052116.down,
    name: '20250602_052116',
  },
  {
    up: migration_20250609_050511.up,
    down: migration_20250609_050511.down,
    name: '20250609_050511',
  },
  {
    up: migration_20250610_054934.up,
    down: migration_20250610_054934.down,
    name: '20250610_054934',
  },
  {
    up: migration_20250611_093329.up,
    down: migration_20250611_093329.down,
    name: '20250611_093329'
  },
];
