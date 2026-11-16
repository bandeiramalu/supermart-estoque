const formulario = document.getElementById("cadastro_prod")
const tabelaBody = document.querySelector("#tabela tbody")
const botaoSalvar = document.getElementById("btn67_salva")
// Guarda a linha que será atualizada; nulo significa que um produto será criado.
let linhaEmEdicao = null

function estoqueBaixo(atual, minimo){
    const margem = 5
    if (atual - minimo <= margem){
        return "Estoque baixo!"
    } else{
        return "OK"
    }
}

// Recalcula os indicadores usando os produtos que estão na tabela.
function atualizarResumo() {
    const totalProdutos = tabelaBody.rows.length
    document.getElementById("prod_total").textContent = totalProdutos

    const somaItens = Array.from(tabelaBody.rows).reduce((total, linha) => {
        const preco = Number(linha.cells[2].textContent)
        const quantidade = Number(linha.cells[3].textContent)
        return total + preco * quantidade
    }, 0)
    document.getElementById("valor_estoque").textContent = somaItens.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })

    const contagemBaixo = Array.from(tabelaBody.rows).reduce((total, linha) => {
        return total + (linha.cells[4].textContent === "Estoque baixo!" ? 1 : 0)
    }, 0)
    document.getElementById("estoque_baixo").textContent = contagemBaixo
}

// Cria os botões com o estilo indicado para cada ação.
function criarBotaoAcao(texto, classe) {
    const botao = document.createElement("button")
    botao.type = "button"
    botao.textContent = texto
    botao.className = `btn-acao ${classe}`
    return botao
}

formulario.addEventListener("submit", function(evento) {
    // Impede o recarregamento da página ao salvar o formulário.
    evento.preventDefault()

    const nome = document.getElementById("nome_prod").value
    const categoria = document.getElementById("categoria_prod").value
    const preco = document.getElementById("preco_prod").value
    const quantidade = document.getElementById("quant_prod").value
    const minimo = document.getElementById("min_prod").value
    let linha = linhaEmEdicao

    // Se não há linha selecionada para edição, cria uma nova linha e seus botões.
    if (!linha) {
        linha = document.createElement("tr")
        for (let i = 0; i < 6; i++) {
            linha.appendChild(document.createElement("td"))
        }

        const colunaAcoes = linha.cells[5]
        const botaoEditar = criarBotaoAcao("Editar", "btn-editar")
        const botaoExcluir = criarBotaoAcao("Excluir", "btn-excluir")

        // Preenche o formulário com os dados da linha escolhida.
        botaoEditar.addEventListener("click", function() {
            document.getElementById("nome_prod").value = linha.cells[0].textContent
            document.getElementById("categoria_prod").value = linha.cells[1].textContent
            document.getElementById("preco_prod").value = linha.cells[2].textContent
            document.getElementById("quant_prod").value = linha.cells[3].textContent
            document.getElementById("min_prod").value = linha.dataset.minimo
            linhaEmEdicao = linha
            botaoSalvar.textContent = "Atualizar produto"
        })

        botaoExcluir.addEventListener("click", function() {
            // Só exclui após confirmação e atualiza os indicadores.
            if (confirm("Deseja excluir este produto?")) {
                if (linhaEmEdicao === linha) {
                    formulario.reset()
                }
                linha.remove()
                atualizarResumo()
            }
        })

        colunaAcoes.append(botaoEditar, botaoExcluir)
        tabelaBody.appendChild(linha)
    }

    linha.cells[0].textContent = nome
    linha.cells[1].textContent = categoria
    linha.cells[2].textContent = preco
    linha.cells[3].textContent = quantidade
    linha.cells[4].textContent = estoqueBaixo(quantidade, minimo)
    // Guarda o estoque mínimo para recuperá-lo ao editar o produto.
    linha.dataset.minimo = minimo

    linhaEmEdicao = null
    atualizarResumo()
    formulario.reset()
})

formulario.addEventListener("reset", function() {
    linhaEmEdicao = null
    botaoSalvar.textContent = "Salvar produto"
})