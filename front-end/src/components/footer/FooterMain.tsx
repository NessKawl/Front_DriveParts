export default function footerMain() {
    return (
        <div className="bg-black-smooth flex flex-col items-center justify-center p-4 mt-20">
            <div className="flex md:flex-row flex-col justify-between md:items-top xs:items-center p-4 text-white w-full">
                <div className="md:hidden w-full flex justify-center mb-4">
                    <h3 className="text-3xl font-bold text-primary-orange">DriveParts</h3>
                </div>
                <div>
                    <h4 className="text-md font-bold text-primary-orange">Redes Sociais</h4>
                    <p>Instagram: @driveparts</p>
                    <p>Facebook: @DriveParts</p>
                </div>
                <div className="hidden md:block">
                    <h3 className="text-3xl font-bold text-primary-orange">DriveParts</h3>
                </div>

                <div>
                    <h4 className="font-semibold text-primary-orange">Contato</h4>
                    <p>Email: 1Lz5A@example.com</p>
                    <p>Telefone: (11) 98765-4321</p>
                    <p>Whatsapp: (11) 98765-4321</p>
                </div>
            </div>
            <div className="text-white text-center">
                <p>Protótipo do PI grupo Drive Parts</p>
                <p>© 2025 DriveParts. Todos os direitos reservados.</p> 
            </div>
            
        </div>
    );
}