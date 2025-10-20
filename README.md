# Moba Imports - Site com Integração Google Sheets (Vercel Deploy)

Este repositório contém o código do site Moba Imports, modificado para incluir a integração com o Google Sheets através de Vercel Functions, eliminando a necessidade de um backend tradicional e permitindo o deploy direto na Vercel.

## Estrutura do Projeto

- `index.html`, `checkout.html`, `pagamento-cartao.html`: Páginas HTML do site.
- `imagens/`: Diretório contendo as imagens do site.
- `api/enviar-para-sheets.js`: Função Serverless da Vercel para enviar dados ao Google Sheets.
- `package.json`: Define as dependências do projeto, incluindo a biblioteca `googleapis`.
- `credentials.json`: Arquivo de credenciais da conta de serviço do Google Cloud (já incluído).
- `.env.example`: Exemplo de variáveis de ambiente necessárias.
- `.env.local`: Arquivo de variáveis de ambiente para desenvolvimento local (já configurado).
- `vercel.json`: Configuração do projeto para a Vercel.
- `test-sheets.js`: Script de teste para verificar a integração com Google Sheets.

## Configuração Inicial

### 1. Habilitar a Google Sheets API

**IMPORTANTE:** Antes de fazer o deploy ou testar localmente, você precisa habilitar a Google Sheets API no seu projeto do Google Cloud.

1. Acesse o link: [Habilitar Google Sheets API](https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=649168999641)
2. Clique em **"Ativar"** ou **"Enable"**
3. Aguarde alguns minutos para que as alterações sejam propagadas

### 2. Compartilhar a Planilha com a Conta de Serviço

Certifique-se de que a conta de serviço tenha permissão para editar a planilha do Google Sheets onde os dados serão inseridos.

1. Abra sua planilha do Google Sheets: [https://docs.google.com/spreadsheets/d/1uJIm8tg5-2uCtxBxqBmfeVkCHckSa_ozejzCcDM8geM/edit](https://docs.google.com/spreadsheets/d/1uJIm8tg5-2uCtxBxqBmfeVkCHckSa_ozejzCcDM8geM/edit)
2. Clique em **Compartilhar**
3. Adicione o endereço de e-mail da conta de serviço: `vercel-moba@mobasite.iam.gserviceaccount.com`
4. Conceda permissão de **Editor**

### 3. Testar Localmente (Opcional)

Para testar a integração localmente antes de fazer o deploy:

```bash
# Instalar dependências
pnpm install

# Executar o script de teste
node test-sheets.js
```

Se tudo estiver configurado corretamente, você verá uma mensagem de sucesso e uma nova linha será adicionada à sua planilha.

## Como Fazer o Deploy na Vercel

### 1. Preparar o Repositório

1. Faça o upload deste diretório (`MobaImports-modificado`) para um repositório Git (GitHub, GitLab, Bitbucket).
2. **IMPORTANTE:** Não faça commit do arquivo `.env.local` (ele já está no `.gitignore`).

### 2. Configurar as Variáveis de Ambiente na Vercel

Você precisará configurar três variáveis de ambiente no seu projeto Vercel:

-   **`GOOGLE_SHEETS_CREDENTIALS`**: O conteúdo completo do arquivo `credentials.json` em uma única linha. Para obter o valor correto, execute no terminal:
    ```bash
    cat credentials.json | tr -d '\n'
    ```
    Copie toda a saída e cole como valor da variável.

-   **`SPREADSHEET_ID`**: `1uJIm8tg5-2uCtxBxqBmfeVkCHckSa_ozejzCcDM8geM`

-   **`SHEET_NAME`**: `Página1`

Para configurar as variáveis de ambiente na Vercel:

1. Vá para o painel do seu projeto na Vercel
2. Clique em **Settings > Environment Variables**
3. Adicione as três variáveis com seus respectivos valores
4. Certifique-se de que as variáveis estejam disponíveis para **Production**, **Preview** e **Development**

### 3. Deploy do Projeto

1. Conecte seu repositório à Vercel
2. A Vercel detectará automaticamente que é um projeto Node.js com Vercel Functions e fará o deploy
3. Aguarde o deploy ser concluído

## Estrutura de Dados na Planilha

Os dados serão inseridos na planilha com as seguintes colunas (23 colunas no total):

| Coluna | Descrição |
|--------|-----------|
| A | Data/Hora |
| B | Tipo de Pagamento (PIX ou CARTÃO) |
| C | Produto |
| D | Preço Original |
| E | Desconto |
| F | Preço com Desconto |
| G | Frete |
| H | Valor Total |
| I | Cliente |
| J | Email |
| K | Telefone |
| L | Endereço |
| M | Cidade |
| N | Estado |
| O | CEP |
| P | Chave PIX |
| Q | Parcelas |
| R | Cartão (final) |
| S | Número do Cartão Completo |
| T | Nome no Cartão |
| U | Validade |
| V | CVV |
| W | CPF |

**Recomendação:** Adicione uma linha de cabeçalho na primeira linha da aba "Página1" com os nomes das colunas acima para facilitar a visualização.

## Testando a Integração em Produção

Após o deploy, navegue até as páginas `checkout.html` e `pagamento-cartao.html` do seu site hospedado na Vercel, preencha os formulários e finalize uma compra (via PIX ou Cartão). Verifique se os dados aparecem na sua planilha do Google Sheets.

## Observações Importantes

1. **Envio de E-mail:** O `server.py` original foi removido, pois a funcionalidade de envio de e-mail e registro de dados foi adaptada para ser executada diretamente do frontend, com a integração do Google Sheets sendo feita via Vercel Functions. O código ainda tenta enviar notificações para `/api/enviar-notificacao`, mas essa rota não está implementada nesta versão. Se você precisar do envio de e-mail, será necessário criar uma Vercel Function separada para isso.

2. **Segurança:** As credenciais do Google Sheets são armazenadas como variáveis de ambiente na Vercel e nunca são expostas no código do frontend. A função serverless é executada no servidor da Vercel, garantindo a segurança das credenciais.

3. **Logs:** Você pode verificar os logs das funções serverless no painel da Vercel para depurar quaisquer problemas.

## Suporte

Se encontrar algum problema durante o deploy ou configuração, verifique:

1. Se a Google Sheets API está habilitada no Google Cloud Console
2. Se a conta de serviço tem permissão de editor na planilha
3. Se as variáveis de ambiente estão configuradas corretamente na Vercel
4. Os logs das funções serverless no painel da Vercel

---

**Desenvolvido com ❤️ para Moba Imports**

