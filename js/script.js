const formulario = document.getElementById("cadastro_prod")

function estoqueBaixo(atual, minimo){
    const margem = 5
    if (atual - minimo <= margem){
        return "Estoque baixo!"
    } else{
        return "OK"
    }
}

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault(); // IMPEDIR QUE A PAGINA RECARREGUE DPS DE CADASTRAR

    // * * PEGA OS ITENS NO FORMS E ENVIA PRA TABELA
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
    const colunaStatus = document.createElement("td")

    colunaNome.textContent = nome
    colunaCategoria.textContent = categoria
    colunaPreco.textContent = preco
    colunaQuantidade.textContent = quantidade
    colunaStatus.textContent = estoqueBaixo(quantidade, minimo)

    linha.appendChild(colunaNome)
    linha.appendChild(colunaCategoria)
    linha.appendChild(colunaPreco)
    linha.appendChild(colunaQuantidade)
    linha.appendChild(colunaStatus)

    tabelaBody.appendChild(linha)

    // * * SOMA OS ITENS DA TABELA PARA APARECER NO RESUMO
    const totalProdutos = tabelaBody.rows.length
    const prod_total = document.getElementById("prod_total")
    prod_total.textContent = totalProdutos

    // * * SOMA O VALOR TOTAL DOS ITENS EM ESTOQUE PARA APARECER NO RESUMO
    const somaItens = Array.from(tabelaBody.rows).reduce((total, linha) => {
        const preco = Number(linha.cells[2].textContent)
        const quantidade = Number(linha.cells[3].textContent)
        return total + preco * quantidade
    }, 0)
    document.getElementById("valor_estoque").textContent = somaItens.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    // * * MOSTRAR QUANTIDADE DE ITENS EM ESTOQUE BAIXO NO RESUMO
    const contagemBaixo = Array.from(tabelaBody.rows).reduce((total, linha) => {
    return total + (linha.cells[4].textContent == "Estoque baixo!" ? 1 : 0)
    }, 0)
    document.getElementById("estoque_baixo").textContent = contagemBaixo   

    formulario.reset()
});