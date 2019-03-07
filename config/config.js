let finalConfig = {
  production: {
    dialect: "postgres",
    use_env_variable: 'DATABASE_URL',
    ssl: true,
    dialectOptions: {
      ssl: true
    },
    pool: {
      max: 5,
      min: 0,
      idle: 20000,
      acquire: 20000
    },
    define: {
      underscored: false,
      freezeTableName: false,
      syncOnAssociation: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
  }
};

if(process.env.DATABASE_URL == undefined){
  finalConfig.development = {
    username: "postgres",
    password: process.env.PG_PASS,
    database: "craft_beer",
    host: "127.0.0.1",
    dialect: "postgres",
    // logging: false,
    pool: {
      max: 15,
      min: 0,
      idle: 20000,
      acquire: 20000
    },
    define: {
      underscored: false,
      freezeTableName: false,
      syncOnAssociation: true,
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  }
}

module.exports = finalConfig;