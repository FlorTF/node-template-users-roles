import app from './app.js'
import { sequelize } from './database.js'



async function main(){
    try{
        await sequelize.sync(
             //{ force: true }
        )
        app.listen(4000)
        console.log('Conexión establecida correctamente',4000)
    }catch(error){
        console.log('Error de conexion', error)
    }   
}

main();