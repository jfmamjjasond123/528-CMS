import * as migration_20250602_052116 from './20250602_052116';
import * as migration_20250609_050511 from './20250609_050511';
import * as migration_20250610_054934 from './20250610_054934';
import * as migration_20250611_093329 from './20250611_093329';
import * as migration_20250617_061823 from './20250617_061823';
import * as migration_20250617_125024 from './20250617_125024';
import * as migration_20250617_125532 from './20250617_125532';
import * as migration_20250618_165250 from './20250618_165250';
import * as migration_20250619_034713 from './20250619_034713';
import * as migration_20250619_035753 from './20250619_035753';
import * as migration_20250619_105917 from './20250619_105917';
import * as migration_20250626_103221 from './20250626_103221';
import * as migration_20250626_110955 from './20250626_110955';
import * as migration_20250630_100730 from './20250630_100730';

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
    name: '20250611_093329',
  },
  {
    up: migration_20250617_061823.up,
    down: migration_20250617_061823.down,
    name: '20250617_061823',
  },
  {
    up: migration_20250617_125024.up,
    down: migration_20250617_125024.down,
    name: '20250617_125024',
  },
  {
    up: migration_20250617_125532.up,
    down: migration_20250617_125532.down,
    name: '20250617_125532',
  },
  {
    up: migration_20250618_165250.up,
    down: migration_20250618_165250.down,
    name: '20250618_165250',
  },
  {
    up: migration_20250619_034713.up,
    down: migration_20250619_034713.down,
    name: '20250619_034713',
  },
  {
    up: migration_20250619_035753.up,
    down: migration_20250619_035753.down,
    name: '20250619_035753',
  },
  {
    up: migration_20250619_105917.up,
    down: migration_20250619_105917.down,
    name: '20250619_105917',
  },
  {
    up: migration_20250626_103221.up,
    down: migration_20250626_103221.down,
    name: '20250626_103221',
  },
  {
    up: migration_20250626_110955.up,
    down: migration_20250626_110955.down,
    name: '20250626_110955',
  },
  {
    up: migration_20250630_100730.up,
    down: migration_20250630_100730.down,
    name: '20250630_100730'
  },
];
