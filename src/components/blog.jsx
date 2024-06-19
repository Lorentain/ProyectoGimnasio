import { useState, useEffect } from 'react';
import { getFirestore, collection, doc, getDoc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from 'react-router-dom';
import '../css/Blog.css';

function Blog() {
    const [titulo, setTitulo] = useState('');
    const [contenido, setContenido] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');
    const [blogs, setBlogs] = useState([]);
    const [rolUsuario, setRolUsuario] = useState('');
    const [userId, setUserId] = useState(null);
    const [cuotaActiva, setCuotaActiva] = useState(false);
    const [visibleCompleto, setVisibleCompleto] = useState({}); // Estado para controlar visibilidad completa de cada artículo
    const [mensajeVisible, setMensajeVisible] = useState(false); // Estado para controlar la visibilidad del mensaje

    const db = getFirestore();
    const auth = getAuth();

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

    useEffect(() => {
        if (userId) {
            const fetchUserRole = async () => {
                try {
                    const userDocRef = doc(db, 'users', userId);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        setRolUsuario(userDoc.data().rol);
                        setCuotaActiva(userDoc.data().cuotaActiva || false); // Obtener el estado de cuotaActiva del usuario
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
        const blogCollectionRef = collection(db, 'blog');
        
        const unsubscribe = onSnapshot(blogCollectionRef, (snapshot) => {
            const blogsArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBlogs(blogsArray);
            // Inicializar el estado de visibilidad completa para cada artículo
            const initialVisibleState = {};
            blogsArray.forEach(blog => {
                initialVisibleState[blog.id] = false; // Por defecto, mostrar solo el extracto
            });
            setVisibleCompleto(initialVisibleState);
        });

        return () => unsubscribe();
    }, [db]);

    async function handleFormSubmit(e) {
        e.preventDefault();
    
        try {
            const blogCollectionRef = collection(db, 'blog');
            const blogDocRef = doc(blogCollectionRef, titulo);
    
            const blogDocSnapshot = await getDoc(blogDocRef);
    
            if (!blogDocSnapshot.exists()) {
                await setDoc(blogDocRef, {
                    titulo: titulo,
                    contenido: contenido // Guardar el contenido tal como está en el estado
                });
                setMensaje(`Documento creado con el título: ${titulo}`);
                setTipoMensaje('exito');
                setMensajeVisible(true); // Mostrar el mensaje
                setTitulo('');
                setContenido('');
            } else {
                setMensaje(`El documento ya existe con el título: ${titulo}`);
                setTipoMensaje('error');
                setMensajeVisible(true); // Mostrar el mensaje
            }
        } catch (error) {
            setMensaje(`Error al crear documento: ${error.message}`);
            setTipoMensaje('error');
            setMensajeVisible(true); // Mostrar el mensaje
            console.error('Error al crear documento en la colección "blog":', error);
        }
    }

    const handleDeleteBlog = async (blogId) => {
        try {
            await deleteDoc(doc(db, 'blog', blogId));
            setMensaje(`Documento con ID ${blogId} eliminado`);
            setTipoMensaje('exito');
            setMensajeVisible(true); // Mostrar el mensaje
        } catch (error) {
            setMensaje(`Error al eliminar el documento: ${error.message}`);
            setTipoMensaje('error');
            setMensajeVisible(true); // Mostrar el mensaje
            console.error('Error al eliminar documento en la colección "blog":', error);
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

    return (
        <>
            <section className="flex flex-col items-center gap-4">
                <h1 className="text-6xl text-center font-bold mt-6 mb-6">Blog</h1>
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
                <div className="bloque-acceso-exclusivo flex flex-col items-center justify-center bg-black text-white p-6 rounded-md">
                    <h2 className="text-lg font-bold mb-2">Acceso a contenido exclusivo (solo miembros)</h2>
                    {cuotaActiva ? (
                        <Link to="/blogpriv" className="btn-blogpriv text-white font-bold text-xl px-4 py-2 rounded-md bg-purple-500">Blog Premium</Link>
                    ) : (
                        <Link to="/cuotas" className="btn-blogpriv text-white font-bold text-xl px-4 py-2 rounded-md bg-purple-500">Pagar una cuota</Link>
                    )}
                </div>

                <div className="contenedor__articulos mt-6 mb-4 w-11/12 flex flex-wrap justify-between gap-12">
                    {blogs.map(blog => (
                        <div key={blog.id} className={`articulo bg-purple-900 p-4 rounded h-auto relative ${rolUsuario === 'admin' ? 'admin' : ''}`}>
                            <h2 className="text-3xl text-white font-bold mb-2">{blog.titulo}</h2>
                            <div className="contenido-articulo text-white text-xl" style={{ whiteSpace: 'pre-line' }}>
                                {visibleCompleto[blog.id] ? (
                                    blog.contenido // Mostrar el contenido completo
                                ) : (
                                    blog.contenido.slice(0, 150) + '...' // Mostrar solo un extracto
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

export default Blog;