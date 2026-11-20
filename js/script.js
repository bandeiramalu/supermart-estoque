const CHAVE_DADOS = "supermartEstoque";
let dados;

const dadosSalvos = localStorage.getItem(CHAVE_DADOS);

if (dadosSalvos) {
    try {
        dados = JSON.parse(dadosSalvos);
    } catch {
        dados = criarDadosIniciais();
    }
} else {
    dados = criarDadosIniciais();
    salvarDados();
}

if (!Array.isArray(dados.produtos) || !Array.isArray(dados.movimentacoes)) {
    throw new Error("Os dados salvos do estoque estão em um formato inválido.");
}

const formulario = document.getElementById("cadastro_prod");
const tabelaProdutos = document.querySelector(
    "#tabela tbody, #tabela_produtos tbody",
);
const campoBusca = document.getElementById("busca_nome");
const filtroCategoria = document.getElementById("categorias");
const corpoEntradas = document.querySelector("#tabela_entradas tbody");
const corpoSaidas = document.querySelector("#tabela_saidas tbody");
const campoBuscaMovimentacoes = document.getElementById("busca_movimentacoes");
const filtroCategoriaMovimentacoes = document.getElementById(
    "categorias_movimentacoes",
);
const botaoSalvar = document.getElementById("btn67_salva");
let produtoEmEdicaoId = null;

function criarDadosIniciais() {
    return {
        produtos: [
            {
                id: "produto-pao",
                nome: "Pão",
                categoria: "Padaria e Confeitaria",
                preco: 8.5,
                quantidade: 30,
                minimo: 10,
            },
            {
                id: "produto-maca",
                nome: "Maçã",
                categoria: "Hortifrúti",
                preco: 6.9,
                quantidade: 25,
                minimo: 8,
            },
            {
                id: "produto-refrigerante",
                nome: "Refrigerante",
                categoria: "Bebidas",
                preco: 7.25,
                quantidade: 40,
                minimo: 12,
            },
            {
                id: "produto-arroz",
                nome: "Arroz",
                categoria: "Mercearia",
                preco: 7.99,
                quantidade: 18,
                minimo: 6,
            },
            {
                id: "produto-leite",
                nome: "Leite",
                categoria: "Frios e Laticínios",
                preco: 9.49,
                quantidade: 20,
                minimo: 8,
            },
            {
                id: "produto-sabonete",
                nome: "Sabonete",
                categoria: "Higiene e Perfumaria",
                preco: 3.25,
                quantidade: 35,
                minimo: 10,
            },
        ],
        movimentacoes: [],
    };
}

function salvarDados() {
    try {
        localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados));
    } catch (erro) {
        alert("Não foi possível salvar as alterações no armazenamento local.");
        throw erro;
    }
}

function criarId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function obterStatusProduto(produto) {
    if (produto.quantidade === 0) {
        return { texto: "Zerado", classe: "zerado", linha: "linha-zerado" };
    }

    if (produto.quantidade <= produto.minimo) {
        return { texto: "Estoque baixo", classe: "baixo", linha: "linha-baixo" };
    }

    return { texto: "OK", classe: "normal", linha: "" };
}

function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function formatarData(data) {
    return new Date(data).toLocaleString("pt-BR");
}

function registrarMovimentacao(produto, tipo, quantidade, detalhe) {
    dados.movimentacoes.push({
        id: criarId(),
        produtoId: produto.id,
        produto: produto.nome,
        categoria: produto.categoria,
        preco: produto.preco,
        tipo,
        detalhe,
        quantidade,
        data: new Date().toISOString(),
    });
}

function criarBotaoAcao(texto, classe, aoClicar) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = texto;
    botao.className = `btn-acao ${classe}`;
    botao.addEventListener("click", aoClicar);
    return botao;
}

function registrarBaixa(produto) {
    const resposta = prompt(
        `Quantas unidades de "${produto.nome}" deseja dar baixa?`,
    );
    if (resposta === null) return;

    const quantidade = Number(resposta);
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        alert("Informe uma quantidade inteira maior que zero.");
        return;
    }

    if (quantidade > produto.quantidade) {
        alert(
            `Estoque insuficiente. Disponível: ${produto.quantidade} unidade(s).`,
        );
        return;
    }

    produto.quantidade -= quantidade;
    registrarMovimentacao(produto, "Saída", quantidade, "Baixa");
    salvarDados();
    renderizarTudo();
}

function registrarEntrada(produto) {
    const resposta = prompt(
        `Quantas unidades de "${produto.nome}" deseja dar entrada?`,
    );
    if (resposta === null) return;

    const quantidade = Number(resposta);
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
        alert("Informe uma quantidade inteira maior que zero.");
        return;
    }

    produto.quantidade += quantidade;
    registrarMovimentacao(produto, "Entrada", quantidade, "Entrada");
    salvarDados();
    renderizarTudo();
}

function criarLinhaProduto(produto, permitirEdicao) {
    const linha = document.createElement("tr");
    const status = obterStatusProduto(produto);
    const valores = [
        produto.nome,
        produto.categoria,
        formatarPreco(produto.preco),
        produto.quantidade,
    ];

    valores.forEach((valor) => {
        const celula = document.createElement("td");
        celula.textContent = valor;
        linha.appendChild(celula);
    });

   if (status.linha) {
        linha.classList.add(status.linha);
    }
    
    const celulaStatus = document.createElement("td");
    const seloStatus = document.createElement("span");
    seloStatus.className = `status status-${status.classe}`;
    seloStatus.textContent = status.texto;
    celulaStatus.appendChild(seloStatus);
    linha.appendChild(celulaStatus);

    linha.cells[4].title = `Estoque mínimo: ${produto.minimo}`;

    const colunaAcoes = document.createElement("td");
    colunaAcoes.appendChild(
        criarBotaoAcao("Entrada", "btn-entrada", () => registrarEntrada(produto)),
    );
    colunaAcoes.appendChild(
        criarBotaoAcao("Baixa", "btn-baixa", () => registrarBaixa(produto)),
    );

    if (permitirEdicao) {
        colunaAcoes.appendChild(
            criarBotaoAcao("Editar", "btn-editar", () => {
                document.getElementById("nome_prod").value = produto.nome;
                document.getElementById("categoria_prod").value = produto.categoria;
                document.getElementById("preco_prod").value = produto.preco;
                document.getElementById("quant_prod").value = produto.quantidade;
                document.getElementById("min_prod").value = produto.minimo;
                produtoEmEdicaoId = produto.id;
                botaoSalvar.textContent = "Atualizar produto";
            }),
        );

        colunaAcoes.appendChild(
            criarBotaoAcao("Excluir", "btn-excluir", () => {
                if (!confirm(`Deseja excluir "${produto.nome}"?`)) return;

                dados.produtos = dados.produtos.filter(
                    (item) => item.id !== produto.id,
                );
                if (produtoEmEdicaoId === produto.id) {
                    formulario.reset();
                }
                salvarDados();
                renderizarTudo();
            }),
        );
    }

    linha.appendChild(colunaAcoes);
    return linha;
}

function atualizarResumo() {
    const totalProdutos = document.getElementById("prod_total");
    const valorEstoque = document.getElementById("valor_estoque");
    const estoqueBaixo = document.getElementById("estoque_baixo");
    if (!totalProdutos || !valorEstoque || !estoqueBaixo) return;

    totalProdutos.textContent = dados.produtos.length;

    const total = dados.produtos.reduce(
        (soma, produto) =>
            soma + Number(produto.preco) * Number(produto.quantidade),
        0,
    );
    valorEstoque.textContent = formatarPreco(total);
    estoqueBaixo.textContent = dados.produtos.filter(
        (produto) => produto.quantidade <= produto.minimo,
    ).length;
}

function aplicarFiltrosProdutos() {
    if (!tabelaProdutos || !campoBusca || !filtroCategoria) return;

    const textoBusca = campoBusca.value.toLowerCase().trim();
    const categoriaEscolhida = filtroCategoria.value;

    Array.from(tabelaProdutos.rows).forEach((linha) => {
        const passouNome = linha.cells[0].textContent
            .toLowerCase()
            .includes(textoBusca);
        const passouCategoria =
            categoriaEscolhida === "Todas as categorias" ||
            linha.cells[1].textContent === categoriaEscolhida;
        linha.style.display = passouNome && passouCategoria ? "" : "none";
    });
}

function adicionarLinhaVazia(tbody, colunas, mensagem) {
    if (tbody.rows.length > 0) return;

    const linha = tbody.insertRow();
    const celula = linha.insertCell();
    celula.colSpan = colunas;
    celula.textContent = mensagem;
    celula.className = "tabela-vazia";
}

function renderizarProdutos() {
    if (!tabelaProdutos) return;

    const permitirEdicao = Boolean(formulario);
    tabelaProdutos.replaceChildren();
    dados.produtos.forEach((produto) => {
        tabelaProdutos.appendChild(criarLinhaProduto(produto, permitirEdicao));
    });
    aplicarFiltrosProdutos();
}

function renderizarTabelaMovimentacoes(tbody, movimentacoes, rotuloVazio) {
    if (!tbody) return;

    tbody.replaceChildren();
    movimentacoes
        .slice()
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .forEach((movimentacao) => {
            const linha = tbody.insertRow();
            const valores = [
                formatarData(movimentacao.data),
                movimentacao.detalhe,
                movimentacao.produto,
                movimentacao.categoria,
                formatarPreco(movimentacao.preco),
                movimentacao.quantidade,
            ];
            valores.forEach((valor) => {
                linha.insertCell().textContent = valor;
            });
        });

    adicionarLinhaVazia(tbody, 6, rotuloVazio);
}

function aplicarFiltrosMovimentacoes() {
    if (!campoBuscaMovimentacoes || !filtroCategoriaMovimentacoes) return;

    const texto = campoBuscaMovimentacoes.value.toLowerCase().trim();
    const categoria = filtroCategoriaMovimentacoes.value;

    const tabelas = [tabelaProdutos, corpoEntradas, corpoSaidas];
    tabelas.forEach((tbody) => {
        if (!tbody) return;

        Array.from(tbody.rows).forEach((linha) => {
            if (
                linha.cells.length < 4 ||
                linha.cells[0].classList.contains("tabela-vazia")
            ) {
                return;
            }

            const celulaProduto =
                tbody === tabelaProdutos ? linha.cells[0] : linha.cells[2];
            const celulaCategoria =
                tbody === tabelaProdutos ? linha.cells[1] : linha.cells[3];
            const passouNome = celulaProduto.textContent
                .toLowerCase()
                .includes(texto);
            const passouCategoria =
                categoria === "Todas as categorias" ||
                celulaCategoria.textContent === categoria;
            linha.style.display = passouNome && passouCategoria ? "" : "none";
        });
    });
}

function renderizarTudo() {
    renderizarProdutos();
    atualizarResumo();
    renderizarTabelaMovimentacoes(
        corpoEntradas,
        dados.movimentacoes.filter((item) => item.tipo === "Entrada"),
        "Nenhuma entrada registrada.",
    );
    renderizarTabelaMovimentacoes(
        corpoSaidas,
        dados.movimentacoes.filter((item) => item.tipo === "Saída"),
        "Nenhuma saída registrada.",
    );
    aplicarFiltrosMovimentacoes();
}

if (formulario) {
    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();

        const produtoAtualizado = {
            nome: document.getElementById("nome_prod").value.trim(),
            categoria: document.getElementById("categoria_prod").value,
            preco: Number(document.getElementById("preco_prod").value),
            quantidade: Number(document.getElementById("quant_prod").value),
            minimo: Number(document.getElementById("min_prod").value),
        };

        if (produtoEmEdicaoId) {
            const produto = dados.produtos.find(
                (item) => item.id === produtoEmEdicaoId,
            );

            if (!produto) {
                produtoEmEdicaoId = null;
                botaoSalvar.textContent = "Salvar produto";
                return;
            }

            const diferenca = produtoAtualizado.quantidade - produto.quantidade;
            Object.assign(produto, produtoAtualizado);

            if (diferenca !== 0) {
                registrarMovimentacao(
                    produto,
                    diferenca > 0 ? "Entrada" : "Saída",
                    Math.abs(diferenca),
                    "Ajuste de estoque",
                );
            }
        } else {
            const produto = { id: criarId(), ...produtoAtualizado };
            dados.produtos.push(produto);
            registrarMovimentacao(produto, "Entrada", produto.quantidade, "Cadastro");
        }

        salvarDados();
        formulario.reset();
        renderizarTudo();
    });

    formulario.addEventListener("reset", () => {
        produtoEmEdicaoId = null;
        botaoSalvar.textContent = "Salvar produto";
    });
}

if (campoBusca && filtroCategoria) {
    campoBusca.addEventListener("input", aplicarFiltrosProdutos);
    filtroCategoria.addEventListener("change", aplicarFiltrosProdutos);
}

if (campoBuscaMovimentacoes && filtroCategoriaMovimentacoes) {
    campoBuscaMovimentacoes.addEventListener(
        "input",
        aplicarFiltrosMovimentacoes,
    );
    filtroCategoriaMovimentacoes.addEventListener(
        "change",
        aplicarFiltrosMovimentacoes,
    );
}

renderizarTudo();
