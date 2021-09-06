'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Adidy extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Mpandray}) {
      this.belongsTo(Mpandray, {foreignKey: 'mpandrayId', as: 'mpandray'});
    }
  };
  Adidy.init({
    total: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    beginAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    tableName: 'adidy',
    modelName: 'Adidy',
  });
  return Adidy;
};