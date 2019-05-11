// Dependencies
// =============================================================
module.exports = function (sequelize, DataTypes) {
  // This may be confusing but here Sequelize (capital) references the standard library

  // sequelize (lowercase) references our connection to the DB.
  // var db = require("../../config/connection");

  // Creates a "user" model that matches up with DB
  var User = sequelize.define("User", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: DataTypes.STRING,
    created_at: DataTypes.DATE
  },
    {

      freezeTableName: true

    });
  // Creating a custom method for our User model. 
  //This will check if an unhashed password entered by the 
  //user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.beforeCreate(function (user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });

  User.associate = function (models) {
    // Associating User with Posts
    // When an User is deleted, also delete any associated Posts
    User.hasMany(models.Transaction, {
      onDelete: "cascade"
    });
  };

  //   {

  //     freezeTableName: true

  // });

  return User;
};
