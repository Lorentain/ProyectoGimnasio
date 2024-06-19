import '../css/Contacto.css'

function contacto() {

    function sendEmail(event) {
        event.preventDefault();

        const asunto = document.getElementById('asunto').value;
        const correo = document.getElementById('correo').value;
        const mensaje = document.getElementById('mensaje').value;

        Email.send({
            Host: "smtp.elasticemail.com",
            Username: "lorentain2@gmail.com",
            Password: "EE4F268B794FBC8CFEA38BBC5C890AE564A1",
            To: 'lorentain2@gmail.com',
            From: 'lorentain2@gmail.com',
            Subject: 'Web Gym Purple',
            Body: `Asunto: ${asunto} <br> Correo: ${correo} <br> Mensaje: ${mensaje}`
        }).then(
            message => alert("Correo enviado correctamente")
        );
    }

    return (
        <>
            <main className="main-contacto flex flex-col items-center">
                <h1 className="text-6xl text-white font-bold text-center mt-6 mb-6">Contacta con Nosotros</h1>
                <form action="" className="form__contacto" onSubmit={sendEmail}>
                    <h1 className="text-4xl text-white font-bold">Gym <span className="text-purple-400">Purple</span></h1>
                    <input type="text" name="asunto" id="asunto" placeholder="Asunto"/>
                    <input type="email" name="correo" id="correo" placeholder="Correo"/>
                    <textarea name="mensaje" id="mensaje" placeholder="Mensaje"></textarea>
                    <input className='cursor-pointer' type="submit" value="Enviar"/>
                </form>
            </main>
        </>
    )
}

export default contacto;