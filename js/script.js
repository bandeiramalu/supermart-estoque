const formulario = document.getElementById("cadastro_prod")

// * * PEGA OS ITENS NO FORMS E ENVIA PRA TABELA
formulario.addEventListener('submit', function(evento) {
    evento.preventDefault(); // IMPEDIR QUE A PAGINA RECARREGUE DPS DE CADASTRAR

    const nome = document.getElementById("nome_prod").value
    const categoria = document.getElementById("categoria_prod").value
    const preco = document.getElementById("preco_prod").value
    const quantidade = document.getElementById("quant_prod").value
    const minimo = document.getElementById("min_prod").value

    const tabelaBody = document.querySelector("#tabela tbody")
    const linha = document.createElement("tr")
    const colunaNome = document.createElement("td")
    const colunaCategoria = document.createElement("td")
    const colunaPreco = document.createElement("td")
    const colunaQuantidade = document.createElement("td")
    const colunaMin = document.createElement("td")

    colunaNome.textContent = nome
    colunaCategoria.textContent = categoria
    colunaPreco.textContent = preco
    colunaQuantidade.textContent = quantidade
    colunaMin.textContent = minimo

    linha.appendChild(colunaNome)
    linha.appendChild(colunaCategoria)
    linha.appendChild(colunaPreco)
    linha.appendChild(colunaQuantidade)
    linha.appendChild(colunaMin)

    tabelaBody.appendChild(linha)

    formulario.reset()
});