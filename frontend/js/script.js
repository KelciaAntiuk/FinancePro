// Funções para abrir e fechar os modais de criação e edição
function openModalCriar() {
  document.getElementById("modalCriar").style.display = "flex";
}

function closeModalCriar() {
  document.getElementById("modalCriar").style.display = "none";
}

function openModalEditar(item) {
  const modal = document.createElement('div');
    modal.className = 'modalEditar';
    modal.id = 'modalEditar';
    modal.style.display = "flex";

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const titulo = document.createElement('h2');
    titulo.textContent = 'Editar item';
    modalContent.appendChild(titulo);

    const form = document.createElement('form');
    form.id = "formEditar"

    // Input: Descrição
    const inputDescricao = document.createElement('input');
    inputDescricao.id = 'descricaoEditar';
    inputDescricao.type = 'text';
    inputDescricao.placeholder = 'Descrição';
    inputDescricao.value = item.descricao || '';
    form.appendChild(inputDescricao);

    // Input: Valor
    const inputValor = document.createElement('input');
    inputValor.id = 'valorEditar';
    inputValor.type = 'number';
    inputValor.placeholder = 'Valor';
    inputValor.value = item.valor || '';
    form.appendChild(inputValor);

    // Select: Tipo
    const selectTipo = document.createElement('select');
    selectTipo.id = 'tipoEditar';

    const optionEntrada = document.createElement('option');
    optionEntrada.value = '1';
    optionEntrada.textContent = 'ENTRADA';
    if (item.tipo === 1) optionEntrada.selected = true;

    const optionSaida = document.createElement('option');
    optionSaida.value = '2';
    optionSaida.textContent = 'SAÍDA';
    if (item.tipo === 2) optionSaida.selected = true;

    selectTipo.appendChild(optionEntrada);
    selectTipo.appendChild(optionSaida);
    form.appendChild(selectTipo);

    // Input: Hidden ID
    const inputId = document.createElement('input');
    inputId.type = 'hidden';
    inputId.name = 'id';
    inputId.value = item.id;
    form.appendChild(inputId);

    // Botão Salvar
    form.appendChild(document.createElement('br'));
    form.appendChild(document.createElement('br'));

    const btnSalvar = document.createElement('button');
    btnSalvar.className = 'add-button';
    btnSalvar.type = 'submit'; // importante: botão deve submeter o form
    btnSalvar.textContent = 'Salvar';
    btnSalvar.onclick = closeModalEditar;
    form.appendChild(btnSalvar);

    modalContent.appendChild(form);
    modal.appendChild(modalContent);

    // Adicionar ao corpo do documento
    document.body.appendChild(modal);

  // Guardar o ID do item no modal para edição posterior
  document.getElementById("formEditar").onsubmit = function (event) {
    event.preventDefault(); // Evitar o envio do formulário
    editarItem(item.id); // Chama a função para editar o item
  };
}

function closeModalEditar() {
  document.getElementById("modalEditar").style.display = "none";
}

function editarItem(id) {
  const descricao = document.getElementById("descricaoEditar").value;
  const valor = parseFloat(document.getElementById("valorEditar").value);
  const tipo = parseInt(document.getElementById("tipoEditar").value);

  console.log("Enviando dados:", { descricao, valor, tipo });

  // Enviar os dados ao servidor via fetch ou AJAX (PUT para edição)
  fetch(`/editar/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ descricao, valor, tipo }),
  })
    .then((response) => response.json())
    .then((data) => {
      // Atualizar a interface (pode ser uma função de renderização aqui)
      closeModalEditar(); // Fechar o modal após salvar
      window.location.reload();
    })
    .catch((error) => {
      modalError(error);
    });
}

// Função de filtro (não implementada no exemplo, mas mantendo a funcionalidade)
function filterList(tipo) {
  console.log(`Filtrando: ${tipo}`);
}

function modalError(erros) {
  const modal = document.getElementById("modalErro");
  const mensagem = document.getElementById("mensagemErro");

  // Verifica se há erro válido no array
  if (erros.length > 0 && erros[erros.length - 1].erro) {
    const textoErro = erros[erros.length - 1].erro;
    mensagem.textContent = textoErro;
    modal.style.display = "flex";

    // Fecha o modal após 5 segundos e limpa o erro no backend
    setTimeout(() => {
      modal.style.display = "none";

      // Remove o erro do array no servidor
      fetch("/error/delete", { method: "DELETE" })
        .then(() => console.log("Erro removido"))
        .catch((err) => console.error("Erro ao remover erro:", err));
    }, 3000);
  }
}
//Atualizar os valores, PARTE DO RIQUE.

/*não é necessário, é só excluir essa função caso queiram.
  serve apenas para deixar o saldo em Reais brasileiros*/
function formatarValor(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

//aqui o código que atualiza o dashboard (entrada, saída e saldo)
function atualizarDashboard() {
  fetch("/api/financeiro")
    .then((res) => res.json())
    .then((dados) => {
      let totalEntrada = 0;
      let totalSaida = 0;

      dados.forEach((item) => {
        const valor = parseFloat(item.valor);
        const tipo = parseInt(item.tipo);
        if (tipo === 1) {
          totalEntrada += valor;
        } else if (tipo === 2) {
          totalSaida += valor;
        }
      });

      const saldo = totalEntrada - totalSaida;

      document.querySelector(".box .entrada + .valor").textContent =
        formatarValor(totalEntrada);
      document.querySelector(".box .saida + .valor").textContent =
        formatarValor(totalSaida);
      document.querySelector(".box .saldo + .valor").textContent =
        formatarValor(saldo);
    })
    .catch((error) => console.error("Erro ao buscar dados:", error));
}

function error() {
  fetch("/error")
    .then((res) => res.json())
    .then((dados) => {
      modalError(dados);
    });
}

//Enrique

//aparece quando carrega
function carregarLista() {
  fetch("/api/financeiro")
    .then((res) => res.json())
    .then((dados) => {
      const lista = document.querySelector(".list");
      lista.innerHTML = "";

      dados.forEach((item) => {
        const div = document.createElement("div");
        div.className = "item";

        const spanDescricao = document.createElement("span");
        spanDescricao.textContent = item.descricao;

        const spanValor = document.createElement("span");
        spanValor.textContent = Number(item.valor).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const spanBadge = document.createElement("span");
        spanBadge.className = "badge " + (item.tipo == 1 ? "entrada" : "saida");
        spanBadge.textContent = item.tipo == 1 ? "Entrada" : "Saída";

        const divButtons = document.createElement("div");
        divButtons.className = "icon-buttons";

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "✏️";
        btnEditar.onclick = () =>
          openModalEditar(item);

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "🗑️";
        btnExcluir.onclick = () => deletarItem(item.id);

        divButtons.appendChild(btnEditar);
        divButtons.appendChild(btnExcluir);

        div.appendChild(spanDescricao);
        div.appendChild(spanValor);
        div.appendChild(spanBadge);
        div.appendChild(divButtons);

        lista.appendChild(div);
      });
    });
}

//filtro

function filterList(tipo) {
  fetch("/api/financeiro")
    .then((res) => res.json())
    .then((dados) => {
      const lista = document.querySelector(".list");
      lista.innerHTML = "";

      const filtrados =
        tipo === "todos"
          ? dados
          : dados.filter((item) => {
              if (tipo === "entrada") return item.tipo == 1;
              if (tipo === "saida") return item.tipo == 2;
            });

      filtrados.forEach((item) => {
        const div = document.createElement("div");
        div.className = "item";

        const spanDescricao = document.createElement("span");
        spanDescricao.textContent = item.descricao;

        const spanValor = document.createElement("span");
        spanValor.textContent = Number(item.valor).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const spanBadge = document.createElement("span");
        spanBadge.className = "badge " + (item.tipo == 1 ? "entrada" : "saida");
        spanBadge.textContent = item.tipo == 1 ? "Entrada" : "Saída";

        const divButtons = document.createElement("div");
        divButtons.className = "icon-buttons";

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "✏️";
        btnEditar.onclick = () =>
          openModalEditar(item);

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "🗑️";
        btnExcluir.onclick = () => deletarItem(item.id);

        divButtons.appendChild(btnEditar);
        divButtons.appendChild(btnExcluir);
        div.appendChild(spanDescricao);
        div.appendChild(spanValor);
        div.appendChild(spanBadge);
        div.appendChild(divButtons);
        lista.appendChild(div);
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  atualizarDashboard();
  carregarLista();

  fetch("/error")
    .then((res) => res.json())
    .then((dados) => {
      modalError(dados);
    });
});
