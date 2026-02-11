** REGRAS DE NEGÓCIO CRÍTICAS **

** 1. VERIFICAÇÃO DE ASSINATURA NO AGENDAMENTO **
** ESSE É SÓ UM MODELO DE CÓDIGO, ANALISAR MELHORES PRÁTICAS **

async function calcularValorAgendamento(
  clienteId: string,
  servicoId: string,
  dataHora: Date
): Promise<{
  valorServico: number;
  valorCobrado: number;
  cobertoAssinatura: boolean;
  assinaturaId: string | null;
  avisoPlanoLimitado: string | null;
}> {
  // 1. Buscar serviço
  const servico = await getServico(servicoId);
  
  // 2. Buscar assinatura ativa do cliente
  const assinatura = await getAssinaturaAtiva(clienteId);
  
  // 3. Se não tem assinatura, cobra valor cheio
  if (!assinatura) {
    return {
      valorServico: servico.preco,
      valorCobrado: servico.preco,
      cobertoAssinatura: false,
      assinaturaId: null,
      avisoPlanoLimitado: null
    };
  }
  
  // 4. Buscar plano da assinatura
  const plano = await getPlano(assinatura.plano_id);
  
  // 5. Verificar se serviço está incluso no plano
  const servicoIncluso = plano.servicos_inclusos.includes(servicoId);
  
  if (!servicoIncluso) {
    return {
      valorServico: servico.preco,
      valorCobrado: servico.preco,
      cobertoAssinatura: false,
      assinaturaId: assinatura.id,
      avisoPlanoLimitado: null
    };
  }
  
  // 6. Verificar restrição de dia
  const diaSemana = dataHora.getDay(); // 0=Dom, 1=Seg, ..., 6=Sab
  const diaPermitido = plano.dias_permitidos === null || 
                       plano.dias_permitidos.includes(diaSemana);
  
  if (!diaPermitido) {
    return {
      valorServico: servico.preco,
      valorCobrado: servico.preco,
      cobertoAssinatura: false,
      assinaturaId: assinatura.id,
      avisoPlanoLimitado: `Seu plano "${plano.nome}" só permite agendamentos às terças, quartas e quintas-feiras. Nesta data, será cobrado o valor normal do serviço.`
    };
  }
  
  // 7. Serviço coberto pelo plano
  return {
    valorServico: servico.preco,
    valorCobrado: 0,
    cobertoAssinatura: true,
    assinaturaId: assinatura.id,
    avisoPlanoLimitado: null
  };
}


** VALIDAÇÃO DE CANCELAMENTO **
** ESSE É SÓ UM MODELO DE CÓDIGO, ANALISAR MELHORES PRÁTICAS **

function podeClienteCancelar(agendamento: Agendamento): {
  pode: boolean;
  motivo?: string;
} {
  const agora = new Date();
  const inicioAgendamento = new Date(agendamento.data_hora_inicio);
  const horasAteAgendamento = (inicioAgendamento.getTime() - agora.getTime()) / (1000 * 60 * 60);
  
  if (agendamento.status !== 'agendado') {
    return { pode: false, motivo: 'Agendamento não pode ser cancelado neste status.' };
  }
  
  if (horasAteAgendamento < 4) {
    return { 
      pode: false, 
      motivo: 'Cancelamento permitido até 4 horas antes do horário agendado. Entre em contato via WhatsApp para assistência.' 
    };
  }
  
  return { pode: true };
}


** INSTRUÇÕES FINAIS **

1. Priorize o fluxo de agendamento: É o core da aplicação. Implemente completamente antes de outras áreas.
2. Teste RLS rigorosamente: Cada tabela deve ter políticas testadas para cada role (cliente, barbeiro, admin).
3. Implemente Realtime: A agenda deve atualizar em tempo real para evitar conflitos de horário.
4. Mobile-first: Toda interface deve funcionar perfeitamente em celulares.
5. Feedback visual: Sempre mostre estados de loading, sucesso e erro.
6. Código limpo: Use TypeScript strict, componentes pequenos e reutilizáveis, hooks customizados.
7. Segurança: Nunca exponha service_role_key, valide inputs no servidor, sanitize dados.
8. Performance: Use React Server Components onde possível, implemente caching, otimize queries.