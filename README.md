# SuperMart | Controle de estoque

Sistema web de gerenciamento de estoque para o mercado **SuperMart**, desenvolvido em **HTML, CSS e JavaScript puro**, sem frameworks. Projeto em trio da disciplina de Programação Web Front-End.

## Funcionalidades

- Cadastrar, editar e excluir produtos (nome, categoria, preço, quantidade e estoque mínimo)
- Listar os produtos em uma tabela
- Buscar por nome e filtrar por categoria
- Registrar entrada e saída de estoque (a saída nunca deixa o estoque negativo)
- Identificar produtos com estoque baixo ou zerado
- Painel de resumo: total de produtos, valor total em estoque e itens com estoque baixo
- Dados salvos no `localStorage` do navegador

## Como executar

1. Clone o repositório:
   ```bash
   git clone <https://github.com/bandeiramalu/supermart-estoque.git>
   ```
2. Abra a pasta do projeto.
3. Abra o arquivo `index.html` no navegador (ou use a extensão Live Server do VS Code).

Não é preciso instalar nada.

## Estrutura do projeto

```
supermart-estoque/
├── index.html        # estrutura da página
├── css/
│   └── style.css     # estilos
├── js/
│   ├── estoque.js    # lógica e dados (sem DOM)
│   └── app.js        # interface (DOM e eventos)
├── .gitignore
└── README.md
```