import nodemailer from 'nodemailer';


const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      });

      const { nombre, email, token } = datos;

      // Enviar el email
      await transport.sendMail({
        from: 'Bienes Raices.com',
        to: email,
        subject: 'Confirma tu cuenta',
        text: `Hola ${nombre}, solo falta un paso para activar tu cuenta`,
        html: `
            <h1>Confirma tu cuenta</h1>
            <p>Hola ${nombre}, solo falta un paso para activar tu cuenta</p>
            <p>
                Presiona el siguiente enlace para confirmar tu cuenta
                <a href="${process.env.BACKEND_URL}:${process.env.PORT}/auth/confirmar/${token}">Confirmar Cuenta</a>
            </p>
            <p> Si tu no solicitaste este correo, puedes ignorarlo</p>
        `
      })
};


const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      });

      const { nombre, email, token } = datos;

      // Enviar el email
      await transport.sendMail({
        from: 'Bienes Raices.com',
        to: email,
        subject: 'Recupera tu contraseña',
        text: `Hola ${nombre}, olvidaste tu contraseña?`,
        html: `
            <h1>Recupera tu contraseña</h1>
            <p>Hola ${nombre}, has solicitado recuperar tu contraseña</p>
            <p>
                Presiona el siguiente enlace para generar una nueva contraseña
                <a href="${process.env.BACKEND_URL}:${process.env.PORT}/auth/olvide-password/${token}">Restablecer Contraseña</a>
            </p>
            <p> Si tu no solicitaste el restablecimiento de tu contraseña, puedes ignorar este correo</p>
        `
      })
};



export {
    emailRegistro,
    emailOlvidePassword
};
