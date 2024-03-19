import bcrypt from 'bcrypt';

const usuarios = [
    {
        nombre: 'admin',
        email: 'admin@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('123456', 10),
    },
];

export default usuarios;
