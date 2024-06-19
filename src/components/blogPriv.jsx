import { useState, useEffect } from 'react';
import { getFirestore, collection, doc, getDoc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import '../css/Blog.css';

function blogPriv() {
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [rolUsuario, setRolUsuario] = useState('');
    const [userId, setUserId] = useState(null);
    const [cuotaActiva, setCuotaActiva] = useState(false);
    const [visibleCompleto, setVisibleCompleto] = useState({});
    const [mensajeVisible, setMensajeVisible] = useState(false);
    const [categoria, setCategoria] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState(''); // Estado para el filtro de categorías

    const categorias = ["Alimentación", "Salud", "Rutinas", "Ejercicios", "Consejos", "Otros"];

    const db = getFirestore();
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribeAuth();
    }, [auth]);

    /* Comprobar si el usuario tiene Cuota Activa para acceder a esta ruta */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const uid = user.uid;
                const userDocRef = doc(db, 'users', uid);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    if (userData.cuotaActiva) {
                        setIsLoading(false);
                    } else {
                        navigate("/cuotas");
                    }
                } else {
                    navigate("/login");
                }
            } else {
                navigate("/login");
            }
        });

        return () => unsubscribe();
    }, [auth, db, navigate]);

    useEffect(() => {
        if (userId) {
            const fetchUserRole = async () => {
                try {
                    const userDocRef = doc(db, 'users', userId);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setRolUsuario(userDoc.data().rol);
                        setCuotaActiva(userDoc.data().cuotaActiva || false);
                    } else {
                        console.error("El documento del usuario no existe");
                    }
                } catch (error) {
                    console.error("Error al obtener el rol del usuario:", error);
                }
            };

            fetchUserRole();
        }
    }, [db, userId]);

    useEffect(() => {
        const blogCollectionRef = collection(db, 'blogPriv');

        const unsubscribe = onSnapshot(blogCollectionRef, (snapshot) => {
            const blogsArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBlogs(blogsArray);
            const initialVisibleState = {};
            blogsArray.forEach(blog => {
                initialVisibleState[blog.id] = false;
            });
            setVisibleCompleto(initialVisibleState);
        });

        return () => unsubscribe();
    }, [db]);

    async function handleFormSubmit(e) {
        e.preventDefault();

        try {
            const blogCollectionRef = collection(db, 'blogPriv');
            const blogDocRef = doc(blogCollectionRef, titulo);

            const blogDocSnapshot = await getDoc(blogDocRef);

            if (!blogDocSnapshot.exists()) {
                await setDoc(blogDocRef, {
                    titulo: titulo,
                    contenido: contenido,
                    categoria: categoria // Incluir la categoría en el documento
                });
                setMensaje(`Documento creado con el título: ${titulo}`);
                setTipoMensaje('exito');
                setMensajeVisible(true);
                setTitulo('');
                setContenido('');
                setCategoria('');
            } else {
                setMensaje(`El documento ya existe con el título: ${titulo}`);
                setTipoMensaje('error');
                setMensajeVisible(true);
            }
        } catch (error) {
            setMensaje(`Error al crear documento: ${error.message}`);
            setTipoMensaje('error');
            setMensajeVisible(true);
            console.error('Error al crear documento en la colección "blogPriv":', error);
        }
    }

    const handleDeleteBlog = async (blogId) => {
        try {
            await deleteDoc(doc(db, 'blogPriv', blogId));
            setMensaje(`Documento con ID ${blogId} eliminado`);
            setTipoMensaje('exito');
            setMensajeVisible(true);
        } catch (error) {
            setMensaje(`Error al eliminar el documento: ${error.message}`);
            setTipoMensaje('error');
            setMensajeVisible(true);
            console.error('Error al eliminar documento en la colección "blogPriv":', error);
        }
    };

    const toggleVisibleCompleto = (blogId) => {
        setVisibleCompleto(prevState => ({
            ...prevState,
            [blogId]: !prevState[blogId]
        }));
    };

    const closeMensaje = () => {
        setMensajeVisible(false);
    };

    const filteredBlogs = categoriaFiltro ? blogs.filter(blog => blog.categoria === categoriaFiltro) : blogs;

    return (
        <>
            <section className="flex flex-col items-center gap-4">
                <h1 className="text-6xl text-center font-bold mt-6 mb-6">Blog Premium</h1>
                {rolUsuario === 'admin' && (
                    <form className="form__blog flex flex-col items-center gap-4 bg-gray-100 border-2 border-black p-4" onSubmit={handleFormSubmit}>
                        <input
                            className="text-black p-2 w-11/12 border-black border-2"
                            type="text"
                            name="titulo"
                            id="titulo"
                            placeholder="Titulo"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            required
                        />
                        <textarea
                            className="h-60 text-black p-2 w-11/12 border-black border-2"
                            name="contenido"
                            id="contenido"
                            placeholder="Contenido"
                            value={contenido}
                            onChange={(e) => setContenido(e.target.value)}
                            required
                        />
                        <select
                            className="text-black p-2 w-11/12 border-black border-2"
                            name="categoria"
                            id="categoria"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                            required
                        >
                            <option value="">Seleccione una categoría</option>
                            {categorias.map((cat, index) => (
                                <option key={index} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <input 
                            className='bg-black text-xl text-white font-bold px-6 py-2 cursor-pointer' 
                            type="submit" 
                            value="Crear" 
                        />
                        {mensajeVisible && (
                            <div className={`relative p-4 rounded ${tipoMensaje === 'exito' ? 'bg-green-500 text-black font-bold' : 'bg-red-500 text-black font-bold'}`}>
                                <p>{mensaje}</p>
                                <button className="absolute top-0 right-1 text-red-600 font-bold" onClick={closeMensaje}>X</button>
                            </div>
                        )}
                    </form>
                )}
                
                <div className="filtro__categorias mb-6">
                    <select
                        className="text-black text-xl p-2 w-12/12 border-black border-2"
                        name="categoriaFiltro"
                        id="categoriaFiltro"
                        value={categoriaFiltro}
                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="contenedor__articulos mt-6 mb-4 w-11/12 flex flex-wrap justify-between gap-12">
                    {filteredBlogs.map(blog => (
                        <div key={blog.id} className={`articulo bg-purple-900 p-4 rounded h-auto relative ${rolUsuario === 'admin' ? 'admin' : ''}`}>
                            <h2 className="text-3xl text-white font-bold mb-2 underline">{blog.titulo}</h2>
                            <p className="text-xl text-white font-bold mb-2">Categoria: {blog.categoria}</p>
                            <div className="contenido-articulo text-white text-xl" style={{ whiteSpace: 'pre-line' }}>
                                {visibleCompleto[blog.id] ? (
                                    blog.contenido
                                ) : (
                                    blog.contenido.slice(0, 150) + '...'
                                )}
                            </div>
                            {blog.contenido.length > 150 && (
                                <button
                                    className="ver-mas-btn text-white font-bold py-2 px-4 mt-2 bg-purple-500 rounded-md"
                                    onClick={() => toggleVisibleCompleto(blog.id)}
                                >
                                    {visibleCompleto[blog.id] ? 'Ver menos' : 'Ver más'}
                                </button>
                            )}
                            {rolUsuario === 'admin' && (
                                <div className="delete-button" onClick={() => handleDeleteBlog(blog.id)}>X</div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

export default blogPriv;