'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mpandray extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Adidy, District}) {
      this.hasMany(Adidy, {foreignKey: 'mpandrayId'});
      this.belongsTo(District, {foreignKey: 'districtId', as: 'district'});
    }
  };
  Mpandray.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: DataTypes.STRING,
    facebook: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'mpandray',
    modelName: 'Mpandray',
  });
  return Mpandray;
};