import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logo from '../../public/logo.png';
import '../firebaseConfig.js'
import '../css/Header.css'

function header() {

    const [usuarioActivo, setUsuarioActivo] = useState(null);
    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, set the active user email
                setUsuarioActivo(user.email);
            } else {
                // User is signed out, clear the active user
                setUsuarioActivo(null);
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    function logout() {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Logout correcto")
            navigate("/");
        }).catch((error) => {
            // An error happened.
        });
    }

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    const closeMenu = () => {
        setMenuAbierto(false);
    };

    return (
        <>
            <header className="bg-purple-900 p-8 border-b-4 border-white">
                <div>
                <Link to="/" ><div className="logo"><img src={logo}/></div></Link>
                </div>
                <ul className="menu flex justify-between items-center gap-10">
                    <div className="menu-li menu-escritorio flex gap-8">
                        <li><p className="text-3xl font-bold text-white"><Link to="/" >Inicio</Link></p></li>
                        <li><p className="text-3xl font-bold text-white"><Link to="/cuotas" >Cuotas</Link></p></li>
                        <li><p className="text-3xl font-bold text-white"><Link to="/blog" >Blog</Link></p></li>
                        <li><p className="text-3xl font-bold text-white"><Link to="/servicios" >Servicios</Link></p></li>
                        <li><p className="text-3xl font-bold text-white"><Link to="/empresa" >Empresa</Link></p></li>
                        <li><p className="text-3xl font-bold text-white"><Link to="/contacto" >Contacto</Link></p></li>
                        <div className="btn-menu-movil" >
                            {usuarioActivo ? (
                                <>
                                    <span className="text-2xl font-bold text-black bg-white p-2 rounded-md"><i className='bx bx-check'></i><Link to="/cuenta">Mi Cuenta</Link></span>
                                    <br></br><br></br>
                                    <span className="text-2xl font-bold text-black bg-white p-2 rounded-md cursor-pointer" onClick={logout}><i className='bx bxs-door-open' ></i>Cerrar Sesión</span>
                                </>
                            ) : (
                                <button className="btn-login flex items-center justify-center">
                                    <Link to="/login">Login<i className='bx bx-log-in text-3xl'></i></Link>
                                </button>
                            )}
                        </div>
                    </div>

                    {menuAbierto && (
                    <div className="menu-li menu-mobile flex gap-8">
                        <li><p className="text-3xl font-bold text-white"><Link to="/" onClick={closeMenu}>Inicio</Link></p></li>
                        <li><p className="text-3xl font-bold text-white"><Link to="/cuotas" onClick={closeMenu}>Cuotas</Link></p></li>
                        <li><p className="text-3xl font-bold text-white"><Link to="/blog" onClick={closeMenu}>Blog</Link></p></li>
                        <li><p className="text-3xl font-bold text-white"><Link to="/servicios" onClick={closeMenu}>Servicios</Link></p></li>
                        <li><p className="text-3xl font-bold text-white"><Link to="/empresa" onClick={closeMenu}>Empresa</Link></p></li>
                        <li><p className="text-3xl font-bold text-white"><Link to="/contacto" onClick={closeMenu}>Contacto</Link></p></li>
                        <div className="btn-menu-movil" onClick={closeMenu}>
                            {usuarioActivo ? (
                                <>
                                    <span className="text-2xl font-bold text-black bg-white p-2 rounded-md"><i className='bx bx-check'></i><Link to="/cuenta">Mi Cuenta</Link></span>
                                    <br></br><br></br>
                                    <span className="text-2xl font-bold text-black bg-white p-2 rounded-md cursor-pointer" onClick={logout}><i className='bx bxs-door-open' ></i>Cerrar Sesión</span>
                                </>
                            ) : (
                                <button className="btn-login flex items-center justify-center">
                                    <Link to="/login">Login<i className='bx bx-log-in text-3xl'></i></Link>
                                </button>
                            )}
                        </div>
                    </div>
                )}

                    <div className="menu-movil" onClick={toggleMenu}>
                        <div><span className="barra" id="barra1"></span></div>
                        <div><span className="barra" id="barra2"></span></div>
                        <div><span className="barra" id="barra3"></span></div>
                    </div>
                </ul>

                <div className="btn-menu">
                    {usuarioActivo ? (
                        <>
                            <span className="text-2xl font-bold text-black bg-white p-2 rounded-md"><i className='bx bx-check'></i><Link to="/cuenta">Mi Cuenta</Link></span>
                            <br></br><br></br>
                            <span className="text-2xl font-bold text-black bg-white p-2 rounded-md cursor-pointer" onClick={logout}><i className='bx bxs-door-open' ></i>Cerrar Sesión</span>
                        </>
                    ) : (
                        <button className="btn-login flex items-center justify-center">
                            <Link to="/login">Login<i className='bx bx-log-in text-3xl'></i></Link>
                        </button>
                    )}
                </div>
            </header>
        </>
    )
}

export default header;