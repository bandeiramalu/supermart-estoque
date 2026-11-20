# SuperMart | Controle de estoque

Sistema web de gerenciamento de estoque para o mercado **SuperMart**, desenvolvido em **HTML, CSS e JavaScript puro**, sem frameworks. Projeto em trio da disciplina de Programação Web Front-End.

## Funcionalidades

- Cadastrar, editar e excluir produtos (nome, categoria, preço, quantidade e estoque mínimo)
- Consultar o mesmo estoque na visão geral e na página de movimentações
- Buscar por nome e filtrar produtos por categoria
- Registrar entradas, ajustes e baixas de estoque com data e hora
- Impedir baixas maiores que o estoque disponível
- Identificar produtos com estoque baixo ou zerado
- Painel de resumo: total de produtos, valor total em estoque e itens com estoque baixo
- Produtos e histórico de movimentações salvos no `localStorage` do navegador

## Como executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/bandeiramalu/supermart-estoque.git
   ```
2. Abra a pasta do projeto no VS Code.
3. Use a extensão Live Server para abrir `visao_geral.html` no navegador.
4. Acesse **Movimentações** pelo menu para consultar o estoque atual e o histórico de entradas e saídas.

Não é preciso instalar nada.

## Estrutura do projeto

```
supermart-estoque/
├── visao_geral.html  # cadastro e visão geral do estoque
├── movimentacoes.html # estoque atual e histórico de movimentações
├── css/
│   └── style.css     # estilos compartilhados
├── js/
│   └── script.js     # lógica de estoque e movimentações
├── .gitignore
└── README.md
```
