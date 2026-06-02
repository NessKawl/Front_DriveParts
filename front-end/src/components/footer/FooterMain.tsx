import { useNavigate } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MessageCircle, ChevronRight } from "lucide-react";

export default function footerMain() {
    const navigate = useNavigate();
    return (
        <footer className="relative mt-20 overflow-hidden">
            {/* Accent line on top */}
            <div className="h-1 bg-gradient-to-r from-primary-orange via-[#ffca6e] to-primary-orange" />

            <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#111111]">
                {/* Subtle pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                        backgroundSize: "32px 32px",
                    }}
                />

                <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-6">
                    {/* Top section */}
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
                        {/* Brand column */}
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <h3 className="text-4xl font-extrabold tracking-tight">
                                <span className="text-primary-orange">Drive</span>
                                <span className="text-white">Parts</span>
                            </h3>
                            <p className="text-white/40 text-sm max-w-xs text-center md:text-left leading-relaxed">
                                As melhores peças automotivas com qualidade e o melhor preço do mercado.
                            </p>
                            {/* Social icons */}
                            <div className="flex gap-3 mt-2">
                                <a
                                    href="#"
                                    className="group w-10 h-10 rounded-xl bg-white/5 border border-white/10
                                               flex items-center justify-center
                                               hover:bg-primary-orange/20 hover:border-primary-orange/40
                                               transition-all duration-300"
                                >
                                    <Instagram
                                        size={18}
                                        className="text-white/50 group-hover:text-primary-orange
                                                   transition-colors duration-300"
                                    />
                                </a>
                                <a
                                    href="#"
                                    className="group w-10 h-10 rounded-xl bg-white/5 border border-white/10
                                               flex items-center justify-center
                                               hover:bg-primary-orange/20 hover:border-primary-orange/40
                                               transition-all duration-300"
                                >
                                    <Facebook
                                        size={18}
                                        className="text-white/50 group-hover:text-primary-orange
                                                   transition-colors duration-300"
                                    />
                                </a>
                                <a
                                    href="#"
                                    className="group w-10 h-10 rounded-xl bg-white/5 border border-white/10
                                               flex items-center justify-center
                                               hover:bg-primary-orange/20 hover:border-primary-orange/40
                                               transition-all duration-300"
                                >
                                    <MessageCircle
                                        size={18}
                                        className="text-white/50 group-hover:text-primary-orange
                                                   transition-colors duration-300"
                                    />
                                </a>
                            </div>
                        </div>

                        {/* Links column */}
                        <div className="flex flex-col items-center md:items-start gap-3">
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-orange mb-1">
                                Redes Sociais
                            </h4>
                            <a href="#" className="group flex items-center gap-2 text-white/60 text-sm
                                                   hover:text-white transition-colors duration-200">
                                <Instagram size={14} className="text-primary-orange/60" />
                                <span>@driveparts</span>
                                <ChevronRight
                                    size={12}
                                    className="opacity-0 -translate-x-1 group-hover:opacity-100
                                               group-hover:translate-x-0 transition-all duration-200
                                               text-primary-orange"
                                />
                            </a>
                            <a href="#" className="group flex items-center gap-2 text-white/60 text-sm
                                                   hover:text-white transition-colors duration-200">
                                <Facebook size={14} className="text-primary-orange/60" />
                                <span>@DriveParts</span>
                                <ChevronRight
                                    size={12}
                                    className="opacity-0 -translate-x-1 group-hover:opacity-100
                                               group-hover:translate-x-0 transition-all duration-200
                                               text-primary-orange"
                                />
                            </a>
                        </div>

                        {/* Contact column */}
                        <div className="flex flex-col items-center md:items-start gap-3">
                            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-orange mb-1">
                                Contato
                            </h4>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <Mail size={14} className="text-primary-orange/60 shrink-0" />
                                <span>contato.fuky@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <Phone size={14} className="text-primary-orange/60 shrink-0" />
                                <span>(11) 98765-4321</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/60 text-sm">
                                <MessageCircle size={14} className="text-primary-orange/60 shrink-0" />
                                <span>(11) 98765-4321</span>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    {/* Bottom section */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-white/30 text-xs">
                            <p>© 2026 DriveParts. Todos os direitos reservados.</p>
                            <span className="hidden md:inline text-white/10">•</span>
                            <p>Protótipo do PI grupo Drive Parts</p>
                            <span className="hidden md:inline text-white/10">•</span>
                            <p className="text-white/20">Versão: 8.0.3</p>
                        </div>
                        <button
                            className="text-xs text-ocean-blue/70 hover:text-ocean-blue
                                       underline underline-offset-2 decoration-ocean-blue/30
                                       hover:decoration-ocean-blue/60 cursor-pointer
                                       transition-all duration-200"
                            onClick={() => navigate("/termos-de-uso")}
                        >
                            Termos de uso
                        </button>
                    </div>
                </div>

                {/* Glow effect */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-32
                                bg-primary-orange/5 rounded-full blur-3xl pointer-events-none" />
            </div>
        </footer>
    );
}