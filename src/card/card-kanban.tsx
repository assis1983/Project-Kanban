import Modal from "react-modal";
import "./style-kanban.css";
import { ApiCard } from "../services/card";
import { deleteCard, editCard } from "../services/card/index";
import { useState, useEffect } from "react";
import { getCards } from "../services/card";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Card = {
  _id: number;
  title: string;
  content: string;
  column: string;
};

const KanbanBoard: React.FC = () => {
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [proximo, setProximo] = useState(1);
  const [deleteCardId, setDeleteCardId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editCardId, setEditCardId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  useEffect(() => {
    async function fetchUserCards() {
      try {
        const userCardsData = await getCards();
        setUserCards(userCardsData);
      } catch (error) {
        console.error("Erro ao buscar os cards do usuário:", error);
      }
    }
    fetchUserCards();
  }, []);

  const abrirModalDeletar = (cardId: number) => {
    setDeleteCardId(cardId);
    setIsDeleteModalOpen(true);
  };

  const fecharModalDeletar = () => {
    setDeleteCardId(null);
    setIsDeleteModalOpen(false);
  };

  const abrirModalEditar = (cardId: number) => {
    setEditCardId(cardId);
    setIsEditModalOpen(true);
    const cardToEdit = userCards.find((card) => card._id === cardId);
    if (cardToEdit) {
      setTitle(cardToEdit.title);
      setEditedContent(cardToEdit.content);
    }
  };

  const fecharModalEditar = () => {
    setEditCardId(null);
    setIsEditModalOpen(false);
    setEditedContent("");
  };
  const abrirAlertModal = () => {
    setIsAlertModalOpen(true);
  };

  const fecharAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  const addCard = async () => {
    if (title.trim() === "" || content.trim() === "") {
      abrirAlertModal();
      return;
    }

    try {
      const data = await ApiCard(title, content);
      const newCard = {
        _id: proximo,
        title: data.title,
        content: data.content,
        column: "TODO",
      };
      setUserCards((prevCards) => [...prevCards, newCard]);
      setProximo((prevId: number) => prevId + 1);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addCard();
    setTitle("");
    setContent("");
  };

  const moveCard = (cardId: number, direction: string) => {
    setUserCards((prevCards: Card[]) =>
      prevCards.map((card) => {
        if (card._id === cardId) {
          switch (direction) {
            case "left":
              if (card.column !== "TODO") {
                return { ...card, column: getPreviousColumn(card.column) };
              }
              break;
            case "right":
              return { ...card, column: getNextColumn(card.column) };
            default:
              return card;
          }
        }
        return card;
      })
    );
  };

  const getPreviousColumn = (currentColumn: string) => {
    switch (currentColumn) {
      case "TODO":
        return "";
      case "DOING":
        return "TODO";
      case "DONE":
        return "DOING";
      default:
        return currentColumn;
    }
  };

  const getNextColumn = (currentColumn: string) => {
    switch (currentColumn) {
      case "":
        return "TODO";
      case "TODO":
        return "DOING";
      case "DOING":
        return "DONE";
      default:
        return currentColumn;
    }
  };

  const handleDeleteCard = async () => {
    if (deleteCardId !== null) {
      try {
        await deleteCard(deleteCardId);
        setUserCards(userCards.filter((card) => card._id !== deleteCardId));
      } catch (error) {
        console.error("Erro ao excluir o cartão:", error);
      } finally {
        fecharModalDeletar();
      }
    }
  };

  const handleEditCard = async () => {
    if (editCardId !== null) {
      try {
        const cardToEdit = userCards.find((card) => card._id === editCardId);

        if (cardToEdit) {
          const updatedCard = await editCard(editCardId, title, editedContent);

          if (updatedCard) {
            setUserCards((prevCards) =>
              prevCards.map((card) =>
                card._id === editCardId
                  ? { ...card, content: updatedCard.content }
                  : card
              )
            );

            fecharModalEditar();

            toast.success("Card editado com sucesso!", {
              position: toast.POSITION.TOP_CENTER,
            });
          } else {
            console.error(
              "Erro ao editar o card: A API não retornou dados atualizados."
            );
            toast.error(
              "Erro ao editar o card: A API não retornou dados atualizados.",
              {
                position: toast.POSITION.TOP_CENTER,
              }
            );
          }
        } else {
          console.error("Card não encontrado para edição.");
          toast.error("Card não encontrado para edição.", {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      } catch (error) {
        console.error("Erro ao editar o conteúdo do cartão:", error);
        toast.error("Erro ao editar o card.", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    }
  };

  const renderCards = (column: string) =>
    userCards
      .filter((userCards) => userCards.column === column)
      .map((card) => (
        <div className="card" key={card._id}>
          <h3>{card.title}</h3>
          <p>{card.content}</p>
          <div className="card-actions">
            {column !== "" && (
              <>
                {column !== "TODO" && (
                  <button
                    className="button-left"
                    onClick={() => moveCard(card._id, "left")}
                  >
                    &larr;
                  </button>
                )}
                <button onClick={() => abrirModalDeletar(card._id)}>
                  Excluir
                </button>
                <button onClick={() => abrirModalEditar(card._id)}>
                  Editar
                </button>
              </>
            )}
            {column !== "DONE" && (
              <button onClick={() => moveCard(card._id, "right")}>
                &rarr;
              </button>
            )}
          </div>
        </div>
      ));

  return (
    <div className="kanban-board">
      <div className="column">
        <h2>New</h2>
        <form onSubmit={handleSubmit} className="form-container">
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
          <textarea
            name="content"
            placeholder="Conteúdo"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea-field"
          ></textarea>
          <button className="submit-button">Adicionar</button>
        </form>
      </div>
      <div className="column">
        <h2>To Do</h2>
        {renderCards("TODO")}
      </div>
      <div className="column">
        <h2>Doing</h2>
        {renderCards("DOING")}
      </div>
      <div className="column">
        <h2>Done</h2>
        {renderCards("DONE")}
      </div>
      {isAlertModalOpen && (
        <Modal
          className="modal-alert"
          isOpen={isAlertModalOpen}
          onRequestClose={fecharAlertModal}
          contentLabel="Alerta"
        >
          <h2>Alerta</h2>
          <p>Por favor, preencha todos os campos antes de adicionar um card.</p>
          <button onClick={fecharAlertModal}>OK</button>
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal
          className="modal-delete"
          isOpen={isDeleteModalOpen}
          onRequestClose={fecharModalDeletar}
          contentLabel="Excluir Cartão"
        >
          <h2>EXCLUIR CARTÃO</h2>
          <p>DESEJA REALMENTE EXCLUIR ESTE CARD?</p>
          <button onClick={fecharModalDeletar}>Não</button>
          <button onClick={handleDeleteCard}>Sim</button>
        </Modal>
      )}
      {isEditModalOpen && (
        <Modal
          className="modal-edit"
          isOpen={isEditModalOpen}
          onRequestClose={fecharModalEditar}
          contentLabel="Editar Conteúdo do Cartão"
        >
          <h2>EDITAR CONTEÚDO DO CARD</h2>
          <textarea
            name="editedContent"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="textarea-field"
          ></textarea>
          <button onClick={handleEditCard}>Salvar</button>
          <button onClick={fecharModalEditar}>Cancelar</button>
        </Modal>
      )}
    </div>
  );
};

export default KanbanBoard;
