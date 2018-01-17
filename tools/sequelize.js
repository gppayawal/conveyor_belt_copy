import Sequelize from 'sequelize';

var sequelize = new Sequelize("conveyor", "root", "tiger", {
	host:"localhost",
	dialect:"mysql"
})
export default sequelize;