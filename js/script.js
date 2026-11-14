const formulario = document.getElementById("cadastro_prod")

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault(); // IMPEDIR QUE A PAGINA RECARREGUE DPS DE CADASTRAR

    // * * PEGA OS ITENS NO FORMS E ENVIA PRA TABELA
    const nome = document.getElementById("nome_prod").value
    const categoria = document.getElementById("categoria_prod").value
    const preco = document.getElementById("preco_prod").value
    const quantidade = document.getElementById("quant_prod").value
    //const minimo = document.getElementById("min_prod").value

    const tabelaBody = document.querySelector("#tabela tbody")
    const linha = document.createElement("tr")
    const colunaNome = document.createElement("td")
    const colunaCategoria = document.createElement("td")
    const colunaPreco = document.createElement("td")
    const colunaQuantidade = document.createElement("td")
    //const colunaMin = document.createElement("td")

    colunaNome.textContent = nome
    colunaCategoria.textContent = categoria
    colunaPreco.textContent = preco
    colunaQuantidade.textContent = quantidade
    //colunaMin.textContent = minimo

    linha.appendChild(colunaNome)
    linha.appendChild(colunaCategoria)
    linha.appendChild(colunaPreco)
    linha.appendChild(colunaQuantidade)
    //linha.appendChild(colunaMin)

    tabelaBody.appendChild(linha)

    // * * SOMA OS ITENS DA TABELA PARA APARECER NO RESUMO
    const totalProdutos = tabelaBody.rows.length
    const prod_total = document.getElementById("prod_total")
    prod_total.textContent = totalProdutos

    // * * SOMA O VALOR TOTAL DOS ITENS EM ESTOQUE PARA APARECER NO RESUMO
    const soma = Array.from(tabelaBody.rows).reduce((total, linha) => {
        const preco = Number(linha.cells[2].textContent)
        const quantidade = Number(linha.cells[3].textContent)
        return total + preco * quantidade
    }, 0)
    document.getElementById("valor_estoque").textContent = soma.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    formulario.reset()
});