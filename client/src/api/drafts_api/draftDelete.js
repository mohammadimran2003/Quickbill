import api from "../axios.js";

const deleteDraft = async (id) => {
  const mutation = `
    mutation DeleteDraft($id: String) {
      deleteDraftOrder(id: $id)
    }
  `;
  console.log(id, "id");

  const response = await api.post("/graphql", {
    query: mutation,
    variables: {
      id,
    },
  });
  return response.data;
};

export default deleteDraft;
