/*Como lucen los datos que estamos guardando */
import {DataTypes} from 'sequelize'
import {sequelize} from '../database.js'
export const ROLES = [ 'admin', 'unprivileged_user']

export const Role = sequelize.define('roles',{
    _id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
    role:{
        type:DataTypes.STRING,
    }
},{
    timestamps: true
}
)