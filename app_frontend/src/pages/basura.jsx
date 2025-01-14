
    const fetchSneakerDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("No estás autenticado. Por favor, inicia sesión.");
                navigate("/login");
                return;
            }
            const response = await fetch(`http://localhost:3000/api/snkrs/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const data = await response.json();
            setSneaker(data);
        } catch (error) {
            console.error("Error al obtener detalles de la zapatilla:", error);
        }
    };
    fetchSneakerDetails();

