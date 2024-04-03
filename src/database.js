import Sequelize from 'sequelize'

export const sequelize = new Sequelize('postgres', 'postgres', 'toor', {
    host: 'localhost',
    dialect: 'postgres',
})