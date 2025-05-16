const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        // Adicionar verificação para a URI do MongoDB
        if (!process.env.MONGODB_CONNECT_URI) {
            throw new Error('A variável de ambiente MONGODB_CONNECT_URI não está definida');
        }
        
        // Configuração opcional para evitar o aviso de depreciação
        mongoose.set('strictQuery', false);
        
        await mongoose.connect(process.env.MONGODB_CONNECT_URI)
        console.log("Connect to MongoDB successfully")
    } catch (error) {
        console.log("Connect failed " + error.message )
    }
}

module.exports = connectDB