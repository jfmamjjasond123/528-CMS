import * as migration_20250602_052116 from './20250602_052116'

export const migrations = [
  {
    up: migration_20250602_052116.up,
    down: migration_20250602_052116.down,
    name: '20250602_052116',
  },
]
