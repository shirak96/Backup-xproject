const rootDir = process.env.NODE_ENV === 'development' ?
    'src' :
    'dist'
console.log('roodDir', rootDir)
module.exports = {
  "type": "sqlite",
  "database": "database.sqlite",
  "synchronize": true,
  "logging": process.env.NODE_ENV === 'development',
  'entities': [rootDir + '/entity/**/*.{js,ts}'],
  'migrations': [rootDir + '/migration/*.{js,ts}'],
  'subscribers': [rootDir + '/subscriber/**/*.{js,ts}'],
  "cli": {
    "entitiesDir": "src/entity",
    "migrationsDir": "src/migration",
    "subscribersDir": "src/subscriber"
  }
}
