import axios from "axios";

export const ApiCard = async (title: string, content: string) => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const token = userData.token;

    const response = await axios.post(
      "https://arnia-kanban.vercel.app/api/card",
      {
        title,
        content,
      },
      {
        headers: {
          "x-api-key": "52a8b954-e25d-4cc5-86e5-c32e92f994bb",
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (response.status === 200) {
      return { title, content };
    } else {
      throw new Error("Erro na requisição");
    }
  } catch (error) {
    throw new Error("Erro na requisição");
  }
};

export const editCard = async (
  cardId: number,
  title: string,
  content: string
) => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const token = userData.token;

    const response = await axios.put(
      `https://arnia-kanban.vercel.app/api/card/${cardId}`,
      {
        title,
        content,
      },
      {
        headers: {
          "x-api-key": "52a8b954-e25d-4cc5-86e5-c32e92f994bb",
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (response.status === 200) {
      console.log("Editado com sucesso");
      return { title, content };
    } else {
      console.error("Erro na edição");
    }
  } catch (error) {
    console.error("Erro na edição", error);
  }
};

export const getCards = async () => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const token = userData.token;

    const response = await axios.get(
      "https://arnia-kanban.vercel.app/api/card", 

      {
        headers: {
          "x-api-key": "52a8b954-e25d-4cc5-86e5-c32e92f994bb",
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (response.status === 200) {
      return response.data; 
    } else {
      throw new Error("Erro ao buscar os cards");
    }
  } catch (error) {
    throw new Error("Erro ao buscar os cards");
  }
};

export const deleteCard = async (cardId: number) => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const token = userData.token;

    const response = await axios.delete(
      `https://arnia-kanban.vercel.app/api/card/${cardId}`,
      {
        headers: {
          "x-api-key": "52a8b954-e25d-4cc5-86e5-c32e92f994bb",
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (response.status === 200) {
      console.log("Excluído com sucesso");
    } else {
      console.error("Erro ao excluir o card");
    }
  } catch (error) {
    console.error("Erro ao excluir o card", error);
  }
};
