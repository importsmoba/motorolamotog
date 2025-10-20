# 🚀 Guia Rápido de Deploy - Moba Imports

## ⚠️ PASSOS OBRIGATÓRIOS ANTES DO DEPLOY

### 1️⃣ Habilitar a Google Sheets API

**Este é o passo mais importante!** Sem isso, a integração não funcionará.

1. Acesse: [https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=649168999641](https://console.developers.google.com/apis/api/sheets.googleapis.com/overview?project=649168999641)
2. Clique em **"Ativar"** ou **"Enable"**
3. Aguarde 2-3 minutos

### 2️⃣ Compartilhar a Planilha

1. Abra sua planilha: [https://docs.google.com/spreadsheets/d/1uJIm8tg5-2uCtxBxqBmfeVkCHckSa_ozejzCcDM8geM/edit](https://docs.google.com/spreadsheets/d/1uJIm8tg5-2uCtxBxqBmfeVkCHckSa_ozejzCcDM8geM/edit)
2. Clique em **"Compartilhar"**
3. Adicione este email: `vercel-moba@mobasite.iam.gserviceaccount.com`
4. Selecione **"Editor"**
5. Clique em **"Enviar"**

### 3️⃣ Adicionar Cabeçalhos na Planilha (Recomendado)

Na primeira linha da aba "Página1", adicione os seguintes cabeçalhos:

```
Data/Hora | Tipo | Produto | Preço Original | Desconto | Preço com Desconto | Frete | Valor Total | Cliente | Email | Telefone | Endereço | Cidade | Estado | CEP | Chave PIX | Parcelas | Cartão (final) | Número Cartão | Nome Cartão | Validade | CVV | CPF
```

---

## 📦 Deploy na Vercel

### Passo 1: Criar Repositório Git

1. Crie um novo repositório no GitHub (ou GitLab/Bitbucket)
2. Faça upload de todos os arquivos deste diretório
3. **IMPORTANTE:** Não faça commit do arquivo `credentials.json` (ele já está no `.gitignore`)

### Passo 2: Conectar à Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Selecione seu repositório
4. Clique em **"Import"**

### Passo 3: Configurar Variáveis de Ambiente

Antes de fazer o deploy, configure estas 3 variáveis:

1. Na tela de configuração do projeto, vá em **"Environment Variables"**
2. Adicione as seguintes variáveis:

**Variável 1: GOOGLE_SHEETS_CREDENTIALS**
- No seu terminal, execute:
  ```bash
  cat credentials.json | tr -d '\n'
  ```
- Copie toda a saída e cole como valor da variável

**Variável 2: SPREADSHEET_ID**
- Valor: `1uJIm8tg5-2uCtxBxqBmfeVkCHckSa_ozejzCcDM8geM`

**Variável 3: SHEET_NAME**
- Valor: `Página1`

3. Certifique-se de marcar as opções: **Production**, **Preview** e **Development**

### Passo 4: Deploy

1. Clique em **"Deploy"**
2. Aguarde o deploy ser concluído (1-2 minutos)
3. Clique no link do seu site para acessá-lo

---

## ✅ Testando

1. Acesse seu site na Vercel
2. Navegue até a página de checkout
3. Preencha os dados e escolha PIX ou Cartão
4. Finalize a compra
5. Verifique se os dados aparecem na planilha do Google Sheets

---

## 🐛 Problemas Comuns

### "Google Sheets API has not been used"
- **Solução:** Habilite a API no passo 1️⃣ e aguarde alguns minutos

### "The caller does not have permission"
- **Solução:** Compartilhe a planilha com a conta de serviço no passo 2️⃣

### "Dados não aparecem na planilha"
- **Solução:** Verifique se as variáveis de ambiente estão configuradas corretamente na Vercel
- Verifique os logs da função serverless no painel da Vercel

### "Error 404 ao enviar dados"
- **Solução:** Certifique-se de que o arquivo `api/enviar-para-sheets.js` está no repositório
- Faça um novo deploy na Vercel

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no painel da Vercel (**Deployments > Seu Deploy > Functions**)
2. Execute o script de teste localmente: `node test-sheets.js`
3. Certifique-se de que todos os passos obrigatórios foram concluídos

---

**Boa sorte com o deploy! 🚀**

