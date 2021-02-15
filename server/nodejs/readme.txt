https://sequelize.org/v5/manual/migrations.html

npm install --save sequelize-cli
npx sequelize-cli init

npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

Automatically adds id, createdAt, and updatedAt into migration file


npx sequelize-cli model:generate --name User --attributes email:string,passwordHash:string,totalIn:double,totalFees:double

npx sequelize-cli model:generate --name Transaction --attributes date:date,action:string,asset:string,count:integer,price:double,fee:double,userId:integer


npx sequelize-cli db:migrate

npx sequelize-cli seed:generate --name demo-user

npx sequelize-cli db:seed:all


module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Person', {
      name: Sequelize.STRING,
      isBetaMember: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'users',
            schema: 'schema'
          }
          key: 'id'
        },
        allowNull: false
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Person');
  }
}