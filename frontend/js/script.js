// Funções para abrir e fechar os modais de criação e edição
function openModalCriar() {
  document.getElementById("modalCriar").style.display = "flex";
}

function closeModalCriar() {
  document.getElementById("modalCriar").style.display = "none";
}

function openModalEditar(id, descricao, tipo, valor) {
  // Preencher os campos do modal de edição com os dados existentes
  document.getElementById("descricaoEditar").value = descricao;
  document.getElementById("valorEditar").value = valor;
  document.getElementById("tipoEditar").value = String(tipo);

  // Guardar o ID do item no modal para edição posterior
  document.getElementById("formEditar").onsubmit = function(event) {
      event.preventDefault();  // Evitar o envio do formulário
      editarItem(id);  // Chama a função para editar o item
  };

  document.getElementById("modalEditar").style.display = "flex";
}

function closeModalEditar() {
  document.getElementById("modalEditar").style.display = "none";
}

function editarItem(id) {
  const descricao = document.getElementById("descricaoEditar").value;
  const valor = parseFloat(document.getElementById("valorEditar").value);
  const tipo = parseInt(document.getElementById("tipoEditar").value);

  console.log('Enviando dados:', { descricao, valor, tipo });

  // Enviar os dados ao servidor via fetch ou AJAX (PUT para edição)
  fetch(`/editar/${id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ descricao, valor, tipo })
  })
  .then(response => response.json())
  .then(data => {
      console.log('Item editado com sucesso', data);
      // Atualizar a interface (pode ser uma função de renderização aqui)
      closeModalEditar();  // Fechar o modal após salvar
      atualizarInterface(id, descricao, valor, tipo);  // Atualiza o item na interface
  })
  .catch(error => {
      console.error('Erro ao editar item:', error);
  });
}

// Função para atualizar a interface (renderizar lista)
function atualizarInterface(id, descricao, valor, tipo) {
  const item = document.querySelector(`.item[data-id="${id}"]`);
  if (!item) {
    console.warn(`Elemento com data-id="${id}" não encontrado.`);
    return;
  }
  if (item){
    item.querySelector('span').textContent = descricao;
    item.querySelector('.valor').textContent = `R$ ${valor.toFixed(2)}`;
    const badge = item.querySelector('.badge');
    const tipoNumero = Number(tipo);
    badge.textContent = tipo === 1 ? 'Entrada' : 'Saída';
    badge.classList.toggle('entrada', tipo === 1);
    badge.classList.toggle('saida', tipo === 2);
  }
}

// Função de filtro (não implementada no exemplo, mas mantendo a funcionalidade)
function filterList(tipo) {
  console.log(`Filtrando: ${tipo}`);
}