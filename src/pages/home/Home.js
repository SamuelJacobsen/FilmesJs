import React, { useState, useEffect } from "react";
import api from "../../services/api";

function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        // Aqui, você deve definir o endpoint correto da sua API. Por exemplo:
        const response = await api.get("/movie/popular"); // Substitua pelo endpoint correto
        setMessage(response.data.message);
      } catch (error) {
        console.error("Erro na solicitação à API: ", error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div>
      <h1>Bem-vindo ao seu Aplicativo de Filmes e Séries</h1>
      <p>{message}</p>
    </div>
  );
}

export default Home;
