import axios from "axios";

export const ApiLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      "https://arnia-kanban.vercel.app/api/user/login",
      {
        email,
        password,
      },
      {
        headers: {
          "x-api-key": "52a8b954-e25d-4cc5-86e5-c32e92f994bb",
          "Content-Type": "application/json",
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0OGE0YjdiMjBkYzExZDNiODFmZTIxNiIsIm5hbWUiOiJUZXN0ZSBUZXN0ZSIsImVtYWlsIjoidGVzdGVAdGVzdGUuY29tIiwiaWF0IjoxNjg2Nzg0OTgxLCJleHAiOjE2ODY4NzEzODF9._E0VMxDo3RmvQSN1A6QKyDdzeLmUKwbXqpPDEZMC_bM",
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;

      localStorage.setItem("userData", JSON.stringify(data));
      localStorage.setItem("userName", data.name);

      return data;
    } else {
      throw new Error("Erro na requisição");
    }
  } catch (error) {
    throw new Error("Erro na requisição");
  }
};

export const ApiCadastro = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const response = await axios.post(
      "https://arnia-kanban.vercel.app/api/user",
      {
        email,
        password,
        name,
      },
      {
        headers: {
          "x-api-key": "52a8b954-e25d-4cc5-86e5-c32e92f994bb",
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Erro na requisição");
    }
  } catch (error) {
    throw new Error("Erro na requisição");
  }
};
