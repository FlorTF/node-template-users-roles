import {DataTypes} from 'sequelize'
import {sequelize} from '../database.js'
import {Role} from '../models/Role.js'

export const User = sequelize.define('users',{
    _id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
    username:{
        type:DataTypes.STRING,
        allowNull: false,
        
    },
    email:{
        type:DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull: false,
        
    }
    
},{
    timestamps: true
}
);

Role.hasOne(User, {
    foreignKey: 'RoleId',
    sourceKey: '_id',
});

User.belongsTo(Role, { 
    foreignKey: 'RoleId', 
    targetKey: '_id',
});