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
  function closeModalEditar() {
    document.getElementById("modalEditar").style.display = "none";
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
      fetch('/error/delete', { method: 'DELETE' })
        .then(() => console.log("Erro removido"))
        .catch((err) => console.error("Erro ao remover erro:", err));
      
    }, 3000);
  }
}
  //Atualizar os valores, PARTE DO RIQUE.
  
  /*não é necessário, é só excluir essa função caso queiram.
  serve apenas para deixar o saldo em Reais brasileiros*/
  function formatarValor(valor) {
    return valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL' });
  }

  //aqui o código que atualiza o dashboard (entrada, saída e saldo)
  function atualizarDashboard() {
    fetch('/api/financeiro')
      .then(res => res.json())
      .then(dados => {
        let totalEntrada = 0;
        let totalSaida = 0;

        dados.forEach(item => {
          const valor = parseFloat(item.valor);
          const tipo = parseInt(item.tipo);
          if (tipo === 1) {
            totalEntrada += valor;
          }else if (tipo === 2) {
            totalSaida += valor;
          }
        });

        const saldo = totalEntrada - totalSaida;

      document.querySelector('.box .entrada + .valor').textContent = formatarValor(totalEntrada);
      document.querySelector('.box .saida + .valor').textContent = formatarValor(totalSaida);
      document.querySelector('.box .saldo + .valor').textContent = formatarValor(saldo);
    })
    .catch(error => console.error('Erro ao buscar dados:', error));   
  }

  function error(){
    fetch('/error')
    .then(res => res.json())
    .then(dados => {
      modalError(dados);
    });
  }

//Executa ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  atualizarDashboard();

  // Verificar se há erro no carregamento
  fetch('/error')
    .then(res => res.json())
    .then(dados => {
      modalError(dados);
    });
});




//Enrique

//aparece quando carrega
function carregarLista() {
  fetch('/api/financeiro')
    .then(res => res.json())
    .then(dados => {
      const lista = document.querySelector('.list');
      lista.innerHTML = ''; 

      dados.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';

        const spanDescricao = document.createElement('span');
        spanDescricao.textContent = item.descricao;

        const spanBadge = document.createElement('span');
        spanBadge.className = 'badge ' + (item.tipo == 1 ? 'entrada' : 'saida');
        spanBadge.textContent = item.tipo == 1 ? 'Entrada' : 'Saída';

        const divButtons = document.createElement('div');
        divButtons.className = 'icon-buttons';

        const btnEditar = document.createElement('button');
        btnEditar.textContent = '✏️';
        btnEditar.onclick = () => openModalEditar(item);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = '🗑️';
        btnExcluir.onclick = () => deletarItem(item.id);

        divButtons.appendChild(btnEditar);
        divButtons.appendChild(btnExcluir);

        div.appendChild(spanDescricao);
        div.appendChild(spanBadge);
        div.appendChild(divButtons);

        lista.appendChild(div);
      });
    });
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarDashboard();
  carregarLista(); 

  fetch('/error')
    .then(res => res.json())
    .then(dados => {
      modalError(dados);
    });
});

//filtro

function filterList(tipo) {
  fetch('/api/financeiro')
    .then(res => res.json())
    .then(dados => {
      const lista = document.querySelector('.list');
      lista.innerHTML = '';

      const filtrados = tipo === 'todos' ? dados : dados.filter(item => {
        if (tipo === 'entrada') return item.tipo == 1;
        if (tipo === 'saida') return item.tipo == 2;
      });

      filtrados.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';

        const spanDescricao = document.createElement('span');
        spanDescricao.textContent = item.descricao;

        const spanBadge = document.createElement('span');
        spanBadge.className = 'badge ' + (item.tipo == 1 ? 'entrada' : 'saida');
        spanBadge.textContent = item.tipo == 1 ? 'Entrada' : 'Saída';

        const divButtons = document.createElement('div');
        divButtons.className = 'icon-buttons';

        const btnEditar = document.createElement('button');
        btnEditar.textContent = '✏️';
        btnEditar.onclick = () => openModalEditar(item);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = '🗑️';
        btnExcluir.onclick = () => deletarItem(item.id);

        divButtons.appendChild(btnEditar);
        divButtons.appendChild(btnExcluir);
        div.appendChild(spanDescricao);
        div.appendChild(spanBadge);
        div.appendChild(divButtons);
        lista.appendChild(div);
      });
    });
}
