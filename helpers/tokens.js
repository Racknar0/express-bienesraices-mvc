

//! Genera un token aleatorio
const generarId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);


export { generarId };