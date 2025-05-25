function openModalCriar() {
    document.getElementById("modalCriar").style.display = "flex";
  }
  function closeModalCriar() {
    document.getElementById("modalCriar").style.display = "none";
  }

  function openModalEditar() {
    document.getElementById("modalEditar").style.display = "flex";
  }
  function closeModalEditar() {
    document.getElementById("modalEditar").style.display = "none";
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

//Executa ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarDashboard);