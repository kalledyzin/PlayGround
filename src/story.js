// ============================================================
// SEMIDEUS: Ecos do Olimpo — HISTÓRIA (pt-BR)
// Estilo Detroit: Become Human | Lore de Percy Jackson + headcanons
// ============================================================
// Stats: olimpo (-100..100), equipe (0..100), sombra (0..100)
// Flags: romances, vivos, kassandraRedimida, profecia, etc.

export const PERSONAGENS = {
  percy: {
    nome: 'Percy Jackson', pai: 'Poseidon', cor: '#1e90ff',
    desc: 'Filho de Poseidon, 19 anos. Herói de duas guerras. Dislexia e TDAH que viram instinto em batalha. Headcanon: tem crises de ansiedade pós-guerra e escreve cartas que nunca envia para Sally.',
    habilidade: 'Hidrocinese — cura na água, sente emoções do mar'
  },
  annabeth: {
    nome: 'Annabeth Chase', pai: 'Atena', cor: '#f5b301',
    desc: 'Filha de Atena, 19 anos. Arquiteta do novo Olimpo. Carrega o caderno de projetos e a adaga de Zoë. Headcanon: fala grego antigo dormindo.',
    habilidade: 'Estrategista — enxerga pontos fracos e armadilhas'
  },
  nico: {
    nome: 'Nico di Angelo', pai: 'Hades', cor: '#7a3cff',
    desc: 'Filho de Hades, 17 anos. Sobreviveu ao Tártaro sozinho. Namora Will Solace. Headcanon: coleciona cartas de Mythomagic e conversa com o fantasma de Bianca.',
    habilidade: 'Umbra — viagem pelas sombras, necromancia'
  },
  kassandra: {
    nome: 'Kassandra', pai: 'Hécate', cor: '#ff2e88',
    desc: 'Filha de Hécate, 20 anos. Vilã / anti-heroína. Quer libertar a magia antiga selada pelos deuses. Baseada no headcanon fã: Hécate foi silenciada no conselho.',
    habilidade: 'Névoa — ilusões, portais, magia verdadeira'
  }
};

export const PROFECIA = `Quando o mar chorar em sangue,
e a sombra beijar a chama,
três meios-sangues decidirão:
o trono que cai ou que se inflama.
Um juramento antigo há de quebrar,
um amor há de escolher o fim —
Olimpo ruirá ou há de mudar
pela mão dos que nasceram assim.`;

// Cada cena: { id, capitulo, quem (protagonista jogável), local3d, titulo, textos[], escolha }
// escolha: { pergunta, tempo, opcoes: [{texto, tag, efeitos, resultado, pct, morte?, proxima?}] }
// efeitos: { olimpo, equipe, sombra, flags }
// Sistema Detroit: fluxo registra caminho; morte desvia para cena alternativa.

export const CENAS = [
  // ============ PRÓLOGO ============
  {
    id: 'prologo_oraculo', capitulo: 'PRÓLOGO — A Nova Profecia', quem: 'percy',
    local: 'oraculo', titulo: 'O Sótão do Acampamento',
    intro: 'Meia-noite. O sótão da Casa Grande. Rachel Elizabeth Dare, o Oráculo, treme. Fumaça verde sai da boca dela.',
    textos: [
      'RACHEL (voz dupla, ecoando): “Quando o mar chorar em sangue...”',
      'PERCY (pensamento): De novo não. Eu conheço esse tom. É o tom de “sua vida acabou de virar de ponta-cabeça”.',
      'QUÍRON: A última Grande Profecia custou uma guerra. Se os Três ouvirem isso... os deuses vão exigir um juramento.',
    ],
    objetivo3d: 'Caminhe até Rachel para ampará-la',
    escolha: {
      pergunta: 'Rachel está tendo uma convulsão profética. O que Percy faz?',
      tempo: 20,
      opcoes: [
        { texto: '🛡️ Segurar Rachel e ouvir até o fim', tag: 'LEAL • HERÓI', pct: 61, efeitos: { equipe: 8, olimpo: 2, flags: ['ouviu_profecia_completa'] }, resultado: 'Você segura Rachel. Ela termina a profecia inteira — cada palavra queima na sua memória. Quíron empalidece: “Os deuses não podem saber da última estrofe.”' },
        { texto: '🌊 Interromper com água para “acordá-la”', tag: 'IMPULSIVO', pct: 24, efeitos: { equipe: -4, sombra: 4, flags: ['profecia_incompleta'] }, resultado: 'Você joga água. Rachel acorda ofegante — a última estrofe se perde na Névoa. “Percy! Eu... eu esqueci o final!” Quíron fecha a cara: agora vocês estão cegos.' },
        { texto: '🌟 HEADCANON FAN: Recitar a profecia junto (ele já sonhou com ela)', tag: 'FAN • INTUIÇÃO DO MAR', pct: 15, efeitos: { equipe: 4, sombra: 8, flags: ['sonho_profecia', 'ouviu_profecia_completa'] }, resultado: 'Headcanon desbloqueado: desde a guerra, Percy sonha com o mar sangrando. Ele completa os versos junto com Rachel. Ela arregala os olhos: “Você também vê?” O vínculo entre vocês se aprofunda.' },
      ]
    }
  },
  // ============ CAP 1 — PERCY ============
  {
    id: 'c1_mar_sangra', capitulo: 'CAP. 1 — O Mar Sangra (Percy)', quem: 'percy',
    local: 'lago', titulo: 'Lago das Canoas — 06:12',
    intro: 'Manhã. Treino de canoagem. De repente a água do lago fica VERMELHA como sangue. Os campistas gritam. Seu peito aperta: o mar está chorando.',
    textos: [
      'ANNABETH (correndo para o píer): Percy! Não entra aí! Pode ser veneno de monstro!',
      'GROVER (farejando): Não é monstro... é DOR. O mar está... triste? Com medo?',
      'PERCY (pensamento): Eu sinto. Como se Poseidon estivesse gritando de longe. Se eu entrar, posso entender. Se eu entrar, posso morrer.',
    ],
    objetivo3d: 'Vá até o píer do lago vermelho',
    escolha: {
      pergunta: 'O lago sangra. Todos olham para você, filho de Poseidon.',
      tempo: 20,
      opcoes: [
        { texto: '🌊 Mergulhar sozinho para sentir a mensagem', tag: 'HERÓICO • RISCO DE MORTE', pct: 43, qte: 'SEGURE [ESPAÇO] PARA PRENDER A RESPIRAÇÃO', efeitos: { equipe: 10, olimpo: -4, sombra: 2, flags: ['mensagem_poseidon'] }, resultado: 'Você mergulha no sangue. Visão: Poseidon acorrentado em correntes de ouro no fundo do mar, sussurrando “Traição no conselho... Hécate...”. Você volta cuspindo vermelho. Annabeth te abraça tremendo.' },
        { texto: '📢 Evacuar a praia primeiro, analisar depois', tag: 'LÍDER • ESTRATÉGIA', pct: 38, efeitos: { equipe: 6, olimpo: 6, flags: ['evacuou_lago'] }, resultado: 'Você vira líder: “TODO MUNDO PARA FORA DA ÁGUA! Clarisse, perímetro! Grover, cheire as bordas!” Ninguém se fere. Quíron assente orgulhoso. Mas a mensagem do mar se dissipa sem resposta...' },
        { texto: '💖 FAN-SERVICE: Pedir que Annabeth mergulhe junto (Percabeth)', tag: 'FAN • ROMANCE', pct: 19, efeitos: { equipe: 12, olimpo: 0, sombra: 0, flags: ['mergulho_casal', 'mensagem_poseidon'] }, resultado: 'Fan-service: você estende a mão. “Comigo? Como no Estige?” Annabeth prende o cabelo: “Sempre.” Vocês mergulham de mãos dadas e OUVEM juntos: correntes, uma voz feminina rindo. Vocês voltam abraçados sob aplausos. Will grita: “CASAL DO ANO!”' },
      ]
    }
  },
  {
    id: 'c1_conselho', capitulo: 'CAP. 1 — O Mar Sangra (Percy)', quem: 'percy',
    local: 'conselho', titulo: 'Casa Grande — Conselho de Guerra',
    intro: 'Quíron reuniu os líderes de chalé. Sr. D gira Diet Coke. A profecia (completa ou não) está sobre a mesa. Tensão.',
    textos: [
      'CLARISSE (filha de Ares): Chega de conversa! Meu chalé quer caçar o que fez isso com o lago. Guerra preventiva!',
      'SR. D (bocejando): Zeus já mandou íris-mensagem: “Nenhum semideus sai do Acampamento. Nenhum juramento novo. Nenhuma... DRAMA.”',
      'PERCY (pensamento): Obedecer ao Olimpo ou proteger o Acampamento? Detroit me ensinou: toda ordem tem um preço.',
    ],
    objetivo3d: 'Aproxime-se da mesa de guerra',
    escolha: {
      pergunta: 'Clarisse propõe desobedecer Zeus e patrulhar a floresta. Sr. D exige obediência. Voto de Minerva: o que Percy decide?',
      tempo: 25,
      opcoes: [
        { texto: '⚔️ Apoiar Clarisse: patrulha secreta à noite', tag: 'REBELDE', pct: 47, efeitos: { olimpo: -12, equipe: 8, flags: ['patrulha_rebelde'] }, resultado: 'Você bate na mesa: “Se esperarmos permissão, vamos enterrar gente.” Clarisse sorri — respeito raro de Ares. Sr. D revira os olhos: “Anotado para o relatório a Zeus.”' },
        { texto: '🏛️ Apoiar Sr. D: obedecer ao Olimpo por enquanto', tag: 'LEAL AO OLIMPO', pct: 31, efeitos: { olimpo: 12, equipe: -4, flags: ['obedeceu_zeus'] }, resultado: 'Você engole o orgulho: “A última vez que ignoramos os deuses, perdemos o Luke.” Silêncio pesado. Clarisse cospe no chão, mas obedece. Sr. D murmura: “Sensato... pela primeira vez.”' },
        { texto: '🌟 HEADCANON: Propor o “Terceiro Caminho” — pedir audiência com Poseidon', tag: 'FAN • LORE', pct: 22, efeitos: { olimpo: 4, equipe: 6, sombra: -4, flags: ['audiencia_poseidon'] }, resultado: 'Headcanon: Percy lembra que pais podem interceder. “Me deixem sonhar com meu pai. Sem sair do Acampamento, sem quebrar regra.” Quíron sorri: “Astúcia de Atena num filho de Poseidon. Annabeth está te influenciando.”' },
      ]
    }
  },
  // ============ CAP 2 — ANNABETH ============
  {
    id: 'c2_arquitetura', capitulo: 'CAP. 2 — Projetos de Atena (Annabeth)', quem: 'annabeth',
    local: 'chales', titulo: 'Chalé 6 — Blueprint da Rebelião',
    intro: 'Você agora é ANNABETH. No seu chalé, entre maquetes do Olimpo reconstruído, você encontra algo ENFIADO no seu caderno: um mapa da Floresta com runas de HÉCATE e sua letra... que você não lembra de ter escrito.',
    textos: [
      'ANNABETH (pensamento): Minha dislexia nunca me fez escrever dormindo... a não ser... a profecia está me USANDO como papel?',
      'MALCOLM (irmão): Annabeth? Você está pálida. Se Atena souber que você esconde magia de Hécate... ela te repudia.',
      'ANNABETH (pensamento): Contar para minha mãe e arriscar punição, ou investigar sozinha como sempre fiz?',
    ],
    objetivo3d: 'Examine a maquete no chalé de Atena',
    escolha: {
      pergunta: 'O mapa proibido em sua letra. O que Annabeth faz?',
      tempo: 25,
      opcoes: [
        { texto: '🔥 Queimar o mapa diante do chalé (lealdade a Atena)', tag: 'LEAL • MEDO', pct: 29, efeitos: { olimpo: 10, equipe: -6, sombra: -6, flags: ['queimou_mapa'] }, resultado: 'Você queima. As chamas ficam ROXAS e sussurram seu nome. Malcolm suspira aliviado, mas naquela noite você sonha com uma mulher de tochas: “Covardezinha de Atena...”' },
        { texto: '🔍 Investigar sozinha à noite na floresta', tag: 'CORAJOSA • RISCO', pct: 44, efeitos: { equipe: 4, sombra: 10, olimpo: -6, flags: ['investigou_mapa', 'conheceu_kassandra'] }, resultado: 'Você vai sozinha, adaga na mão. Na clareira: uma garota de cabelo bicolor desenha portais — KASSANDRA, filha de Hécate. “Finalmente. A arquiteta veio ver a fundação podre do Olimpo.”' },
        { texto: '💖 FAN-SERVICE: Mostrar a Percy primeiro (“sem segredos”)', tag: 'FAN • PERCABETH', pct: 27, efeitos: { equipe: 12, sombra: 4, flags: ['investigou_mapa', 'conheceu_kassandra', 'casal_investiga'] }, resultado: 'Pacto Percabeth: sem segredos desde o Tártaro. Percy lê e empalidece: “Minha visão... correntes de ouro... tem a ver com isso.” Vocês vão JUNTOS à floresta. Kassandra sorri: “O casal de cartaz do Olimpo veio me matar?”' },
      ]
    }
  },
  {
    id: 'c2_kassandra', capitulo: 'CAP. 2 — Projetos de Atena (Annabeth)', quem: 'annabeth',
    local: 'floresta', titulo: 'Clareira de Hécate — Meia-noite',
    intro: 'Kassandra revela: Hécate e outros deuses menores foram selados num “juramento de silêncio” por Zeus após a guerra. A magia está apodrecendo — o lago sangrou por isso. Ela quer QUEBRAR o Olimpo para libertá-los.',
    textos: [
      'KASSANDRA: Sua mãe Atena votou A FAVOR do selamento, sabia? Sabedoria, né? Silenciar os fracos.',
      'ANNABETH (pensamento): Se for verdade... minha mãe ajudou a torturar uma deusa. Meu mundo racha. Mas Kassandra quer explodir TUDO — chalés, crianças, tudo.',
      'KASSANDRA: Junte-se a mim, arquiteta. Derrube o Olimpo COMIGO e reconstrua do zero. Ou me entregue e veja o Acampamento apodrecer.',
    ],
    objetivo3d: 'Encare Kassandra na clareira',
    escolha: {
      pergunta: 'Kassandra estende a mão envolta em Névoa roxa. Troque o destino agora?',
      tempo: 25,
      opcoes: [
        { texto: '🤝 Fingir aliança para espioná-la por dentro', tag: 'ESTRATÉGIA • PERIGO', pct: 36, efeitos: { sombra: 12, equipe: 4, olimpo: -8, flags: ['infiltrada'] }, resultado: 'Você aperta a mão dela. A Névoa queima fria. “Boa escolha”, ela sussurra. Por dentro você treme: se Percy descobrir e entender errado... tudo acaba. Espiã de Atena em terra de Hécate.' },
        { texto: '⚔️ Recusar e desafiá-la para um duelo de inteligência', tag: 'ORGULHO DE ATENA', pct: 41, efeitos: { olimpo: 8, equipe: 6, sombra: -4, flags: ['duelo_inteligencia'] }, resultado: '“Minha mãe me ensinou a não apertar mãos com veneno.” Você propõe enigma contra enigma. Kassandra ri genuinamente: “ENFIM alguém interessante! Amanhã, no labirinto. Se eu vencer, você me ajuda.”' },
        { texto: '🌟 HEADCANON FAN: “Me mostre as correntes primeiro” (cética de Atena)', tag: 'FAN • SABEDORIA', pct: 23, efeitos: { sombra: 6, equipe: 6, olimpo: 0, flags: ['viu_correntes', 'infiltrada'] }, resultado: 'Headcanon: filha de Atena nunca compra história sem prova. Kassandra abre um portal — vocês VEEM Poseidon acorrentado e Hécate amordaçada. Seu estômago vira. “...Ok. Me conta tudo. DO começo.” Kassandra pisca surpresa: ninguém nunca pediu a versão dela.' },
      ]
    }
  },
  // ============ CAP 3 — NICO ============
  {
    id: 'c3_sombra', capitulo: 'CAP. 3 — Sombras que Chamam (Nico)', quem: 'nico',
    local: 'enfermaria', titulo: 'Enfermaria — Chalé de Apolo',
    intro: 'Você agora é NICO DI ANGELO. Will está curando campistas queimados pela água vermelha. Chega um MENINO FANTASMA que só você vê: “Ela está usando as sombras para atravessar. Diga ao filho de Hades que o pai dele mente.”',
    textos: [
      'WILL (segurando sua mão): Nico? Você ficou branco. Fala comigo. Por favor.',
      'NICO (pensamento): Bianca me visita em sonhos de novo. Dizendo que Hades mente. Meu pai... mentiria para mim? Depois de tudo?',
      'FANTASMA: À meia-noite, na Colina. Sozinho. Ou ela mata os curandeiros primeiro.',
    ],
    objetivo3d: 'Vá até Will na enfermaria',
    escolha: {
      pergunta: 'O fantasma ameaça os curandeiros se Nico não for sozinho. Will percebe seu medo. O que fazer?',
      tempo: 25,
      opcoes: [
        { texto: '🌑 Ir sozinho à Colina (proteger Will)', tag: 'SACRIFÍCIO • RISCO DE MORTE', pct: 39, qte: 'PRESSIONE [E] 3x PARA ATRAVESSAR AS SOMBRAS', efeitos: { equipe: -6, sombra: 14, flags: ['nico_sozinho'] }, resultado: 'Você mente: “É só... preciso de ar.” E some nas sombras antes que Will segure sua mão. Na Colina: Bianca — ou ALGO com o rosto dela — espera. Seu coração racha.' },
        { texto: '☀️ Contar tudo a Will e irem juntos (Solangelo)', tag: 'CONFIANÇA • AMOR', pct: 45, efeitos: { equipe: 14, sombra: 2, flags: ['solangelo_juntos'] }, resultado: 'Você respira e conta. Will aperta sua mão: “Bobinho. ‘Para sempre’ inclui fantasma chantagista.” Ele pega o arco e vai com você. Pela primeira vez, a sombra não parece tão fria com o sol do lado.' },
        { texto: '💀 HEADCANON: Consultar o Mythomagic / falar com Bianca via ritual', tag: 'FAN • NECROMANCIA', pct: 16, efeitos: { sombra: 10, equipe: 2, flags: ['ritual_bianca'] }, resultado: 'Headcanon fã: Nico usa as cartas de Mythomagic da infância como foco e invoca Bianca de verdade. Ela chora: “Não sou eu na Colina, fratellino. É ELA usando meu rosto. Me perdoa.” Você ganha a verdade — e uma carta rara que brilha.' },
      ]
    }
  },
  {
    id: 'c3_colina', capitulo: 'CAP. 3 — Sombras que Chamam (Nico)', quem: 'nico',
    local: 'colina', titulo: 'Colina Meio-Sangue — Meia-noite',
    intro: 'A “Bianca” falsa se dissolve em Névoa: é KASSANDRA. Ela oferece a Nico o que Hades nunca deu: trazer Bianca de volta de verdade, quebrar as portas da morte, acabar com o preconceito contra filhos do Mundo Inferior.',
    textos: [
      'KASSANDRA: Seu pai votou para selar Hécate também, sabia? Hades, o “leal”. Os deuses cospem nos seus filhos e você ainda obedece?',
      'NICO (pensamento): Bianca viva... Will em perigo... Acampamento apodrecendo... O poder dela é real. Eu senti. Eu poderia...',
      'KASSANDRA: Traga-me a adaga de Annabeth à meia-noite de amanhã e eu rasgo o véu. Recuse... e o próximo curandeiro a cair é o loirinho.',
    ],
    objetivo3d: 'Suba a Colina até o Pinheiro de Thalia',
    escolha: {
      pergunta: 'Ameaça contra Will. Promessa de Bianca. O que o filho de Hades escolhe?',
      tempo: 25,
      opcoes: [
        { texto: '🗡️ Roubar a adaga de Annabeth para salvar Will', tag: 'SOMBRIO • TRAIÇÃO?', pct: 28, efeitos: { sombra: 18, equipe: -14, olimpo: -10, flags: ['roubou_adaga'] }, resultado: 'Sua mão treme, mas o rosto de Will dormindo decide por você. Você furta a adaga do chalé 6. O metal chora. Você chora junto — e odeia cada segundo.' },
        { texto: '☀️ Recusar e avisar o Acampamento (mesmo em risco)', tag: 'HERÓI • CORAGEM', pct: 52, efeitos: { equipe: 10, olimpo: 4, sombra: -8, flags: ['avisou_acampamento'] }, resultado: '“Você não conhece o Will. Ele me ressuscitaria só para me matar por trair meus amigos.” Você cospe sombra nos pés dela e corre. Atrás, a risada dela vira trovão: “ENTÃO GUERRA!”' },
        { texto: '🌟 HEADCANON FAN: Propor trocar — sua vida pela de Bianca (pacto hadesiano)', tag: 'FAN • TRÁGICO', pct: 20, efeitos: { sombra: 14, equipe: 6, flags: ['pacto_hadesiano'] }, resultado: 'Headcanon: filho de Hades conhece as leis antigas. “Toda ressurreição cobra troca. Leve MEUS anos, não meus amigos.” Kassandra para, chocada — ninguém nunca ofereceu a si mesmo. “...Você é estranho, di Angelo. Eu gosto disso.”' },
      ]
    }
  },
  // ============ CAP 4 — CLÍMAX ============
  {
    id: 'c4_guerra', capitulo: 'CAP. 4 — O Conselho Dividido', quem: 'percy',
    local: 'anfiteatro', titulo: 'Anfiteatro — Julgamento ao Amanhecer',
    intro: 'Tudo explode: a patrulha rebelde capturou um espião de Névoa, o roubo da adaga (ou o pacto) veio à tona, e ZEUS APARECE em forma de holograma trovejante exigindo a entrega de Kassandra E dos semideuses “contaminados”. O Acampamento se divide em dois lados no anfiteatro.',
    textos: [
      'ZEUS: ENTREGUEM A BRUXA E OS TRAIDORES — OU O ACAMPAMENTO ARDE.',
      'ANNABETH (pensamento via Percy): Ele chama minha melhor pista de “bruxa”. Meu pai... minha mãe votou no selamento...',
      'NICO (pensamento via Percy): Will está na enfermaria cercado de guardas de Ares. Uma palavra errada e...',
      'PERCY (pensamento): Todos olham para mim. Como sempre. Droga. DETROIT final: Connor decide. Agora sou eu.',
    ],
    objetivo3d: 'Suba ao palco do anfiteatro',
    escolha: {
      pergunta: 'Zeus exige obediência total. Kassandra surge num portal oferecendo fuga + revolução. O Acampamento espera sua ordem, Percy.',
      tempo: 30,
      opcoes: [
        { texto: '🏛️ Ajoelhar-se a Zeus e entregar Kassandra', tag: 'OBEDIÊNCIA • PREÇO?', pct: 22, efeitos: { olimpo: 25, equipe: -20, sombra: -15, flags: ['entregou_kassandra'] }, resultado: 'Silêncio mortal. Você se ajoelha. Clarisse cospe: “Covarde!” Annabeth desvia o olhar. Um raio leva Kassandra gritando. Zeus ronrona: “Bom menino.” Mas à noite, o lago volta a sangrar PIOR.' },
        { texto: '🔥 Quebrar o juramento em público e declarar o Acampamento livre', tag: 'REVOLUÇÃO • GUERRA', pct: 48, efeitos: { olimpo: -25, equipe: 18, sombra: 8, flags: ['revolucao'] }, resultado: 'Você ergue Contracorrente: “NÃO! Chega de juramentos feitos COM nosso sangue e SEM nossa voz!” O anfiteatro EXPLODE em gritos. Thalia aparece na colina com as Caçadoras: “FINALMENTE!” Zeus troveja... e desliga. Guerra declarada.' },
        { texto: '🌟 HEADCANON FAN: Desafiar Zeus para um AGON (julgamento por combate de palavras)', tag: 'FAN • AUDÁCIA ATENIENSE', pct: 30, efeitos: { olimpo: 8, equipe: 14, sombra: 0, flags: ['agon'] }, resultado: 'Headcanon épico: Annabeth te ensinou — deuses ADORAM apostas. “Um agon! Se vencermos, o conselho nos ouve. Se perdermos, nos entregue.” Zeus ri, vaidoso: “ACEITO. Amanhã. No Labirinto.” O Acampamento ganha UMA noite.' },
      ]
    }
  },
  {
    id: 'c4_labirinto', capitulo: 'CAP. 4 — O Conselho Dividido', quem: 'annabeth',
    local: 'labirinto', titulo: 'Entrada do Labirinto — A Última Noite',
    intro: 'Véspera do agon/julgamento/guerra. Os três se reúnem escondidos na entrada do Labirinto. Kassandra aparece — ferida (ou livre, conforme sua escolha). Ela revela o custo real: quebrar o selo EXIGE a vida de um meio-sangue voluntário. Ela ia se oferecer. Sempre foi suicídio.',
    textos: [
      'KASSANDRA (sangrando Névoa): Eu ia... explodir o selo comigo dentro. Hécate me criou para isso. Uma arma, não uma filha.',
      'PERCY: Não. A gente não sacrifica amigos. A gente ACHOU outro jeito antes. No Tártaro. Na guerra...',
      'NICO: Eu conheço o preço de rasgar o véu. (Ele olha para Will dormindo na sua mente.) Alguém tem que...',
      'ANNABETH (pensamento): Arquitetura: toda fundação cobra peso. Quem sustenta? Eu calculo. Eu decido. Como sempre.',
    ],
    objetivo3d: 'Reúna os três no círculo de pedras',
    escolha: {
      pergunta: 'Kassandra revela: libertar os selados exige uma vida voluntária. Amanhã é o dia. Quem se oferece? (Esta escolha DEFINE o final.)',
      tempo: 30,
      opcoes: [
        { texto: '🌊 “Eu vou.” — Percy se oferece (culpa do herói)', tag: 'SACRIFÍCIO • MORTE?', pct: 31, morte: 'percy', efeitos: { equipe: 20, olimpo: -5, sombra: 5, flags: ['sacrificio_percy'] }, resultado: 'Percy sorri torto: “O mar começou isso. O mar termina.” Annabeth soluça. Nico segura o ombro dele. Kassandra chora pela primeira vez: “Heróis... sempre heróis...”' },
        { texto: '🦉 “Eu vou.” — Annabeth se oferece (arquiteta sustenta a obra)', tag: 'SACRIFÍCIO • MORTE?', pct: 27, morte: 'annabeth', efeitos: { equipe: 20, olimpo: 5, sombra: -5, flags: ['sacrificio_annabeth'] }, resultado: 'Annabeth ajusta o caderno: “Toda estrutura precisa de uma pedra-chave. Eu sou a pedra.” Percy grita NÃO. Ela beija a testa dele: “Me promete redesenhar o mundo melhor.”' },
        { texto: '💀 “Eu vou.” — Nico se oferece (o menino que sobreviveu a tudo)', tag: 'SACRIFÍCIO • MORTE?', pct: 26, efeitos: { equipe: 20, sombra: 15, flags: ['sacrificio_nico'] }, resultado: 'Nico dá de ombros: “Faz sentido. O filho da morte paga a morte.” Will chega correndo tarde demais: “NICO, NÃO!” O fantasma de Bianca aparece e segura a mão do irmão: “Dessa vez eu te acompanho.”' },
        { texto: '🌟 HEADCANON FAN: “NINGUÉM morre.” — plano maluco dos três + Kassandra', tag: 'FAN • ESPERANÇA • DIFÍCIL', pct: 16, efeitos: { equipe: 25, olimpo: -10, sombra: -5, flags: ['plano_ninguem_morre'] }, resultado: 'Headcanon fã supremo: “Desde quando aceitamos preço de deus?” Os QUATRO dão as mãos — mar + sabedoria + sombra + névoa = magia nunca vista. O Labirinto TREME. Kassandra ri chorando: “Vocês vão me matar... de esperança.”' },
      ]
    }
  },
];

export const FINAIS = {
  novo_olimpo: {
    titulo: 'FINAL A — O NOVO OLIMPO 🏛️',
    condicao: 'olimpo alto ou agon vencido, sem mortes',
    texto: 'O selo é quebrado SEM mortes (o plano dos quatro divide o preço em quatro cicatrizes). Zeus, humilhado no agon, é forçado a aceitar: semideuses ganham assento no conselho. Atena pede perdão à filha de joelhos. Poseidon abraça Percy num redemoinho. Hades reconhece Nico em público pela primeira vez. Kassandra vira professora de Magia Verdadeira no Acampamento. Na última cena, Percy recusa a imortalidade DE NOVO — “já recusei duas vezes, vai virar piada” — e Annabeth mostra a maquete: um Olimpo com rampas, chalés para deuses menores e um jardim para Bianca.',
  },
  revolucao: {
    titulo: 'FINAL B — A REBELIÃO DO ACAMPAMENTO 🔥',
    condicao: 'revolução declarada / olimpo muito baixo',
    texto: 'Guerra. O Acampamento repele a primeira legião de espíritos da tempestade graças à estratégia de Annabeth + hidrocinese de Percy + sombras de Nico. Thalia e as Caçadoras viram a maré. Kassandra — redimida ou mártir conforme suas escolhas — rasga o selo no meio da batalha. Os deuses menores libertos viram o jogo. Zeus recua, não por bondade, mas por medo. Preço: o Acampamento vira fortaleza independente, sem proteção divina. Última fala de Quíron: “Que os deuses nos perdoem... ou que aprendam conosco.”',
  },
  sombras: {
    titulo: 'FINAL C — O REI DAS SOMBRAS 🌑',
    condicao: 'sombra muito alta / adaga roubada / pacto sombrio',
    texto: 'O poder da Névoa + Morte corrompe o ritual. Nico (ou quem empunhou a adaga) absorve o selo inteiro e vira algo novo: nem deus, nem mortal — o REI DAS SOMBRAS. Ele quebra as correntes, mas seus olhos ficam pretos. Will segura o rosto dele: “Volta pra mim.” Última escolha do jogador ecoa: se o vínculo da equipe é forte, o amor ancora Nico e ele sobrevive dividido; se não, ele se exila para o Mundo Inferior com Bianca e Kassandra como corte sombria. Percy chora no lago — que agora é negro e calmo.',
  },
  sacrificio: {
    titulo: 'FINAL D — O ÚLTIMO SACRIFÍCIO 🕯️',
    condicao: 'alguém se ofereceu e morreu',
    texto: 'Alguém não voltou. O selo quebrou com UM coração voluntário — o preço mais antigo. O Acampamento chora por sete dias (sete — número de Apolo). Os deuses, envergonhados diante de um funeral de semideus, assinam a Carta dos Meio-Sangues: nunca mais selos, nunca mais segredos. Na colina, ao lado do pinheiro de Thalia, nasce uma nova árvore — da cor do mar, da coruja ou da sombra, conforme quem partiu. E toda meia-noite, dizem os campistas, dá para ouvir risadas vindas do Labirinto: os três (agora dois) + Kassandra rindo como antes.',
  },
};

export function calcularFinal(state) {
  if (state.flags.includes('revolucao')) return 'revolucao';
  const mortes =
    (state.flags.includes('sacrificio_percy') ? 1 : 0) +
    (state.flags.includes('sacrificio_annabeth') ? 1 : 0) +
    (state.flags.includes('sacrificio_nico') ? 1 : 0);
  if (mortes > 0 && !state.flags.includes('plano_ninguem_morre')) return 'sacrificio';
  if (state.sombra >= 55) return 'sombras';
  if (state.olimpo <= -15) return 'revolucao';
  return 'novo_olimpo';
}

export const EPILOGOS_FAN = [
  { cond: ['mergulho_casal', 'casal_investiga'], texto: '💖 Epílogo Percabeth: Annabeth desenha a cabana 6½ — “metade mar, metade biblioteca”. Percy aprende a dizer “eu te amo” em grego antigo sem gaguejar. (Headcanon realizado.)' },
  { cond: ['solangelo_juntos'], texto: '☀️🌑 Epílogo Solangelo: Will pendura sininhos de vento na porta do chalé de Hades “para a sombra nunca ficar silenciosa”. Nico finge odiar. Não odeia. (Headcanon realizado.)' },
  { cond: ['sonho_profecia'], texto: '🌊 Epílogo do Mar: Percy escreve finalmente a carta para Sally — e ENTREGA. Ela emoldura. Poseidon chora no fundo do mar e chove em Manhattan. (Headcanon realizado.)' },
  { cond: ['viu_correntes', 'infiltrada'], texto: '🦉 Epílogo de Atena: Atena devolve o caderno de Annabeth com uma anotação: “Você me superou, minha filha. Me ensine.” Annabeth chora por uma hora. (Headcanon realizado.)' },
  { cond: ['ritual_bianca'], texto: '💀 Epílogo di Angelo: a carta rara de Mythomagic brilha de verdade uma noite — é Bianca dizendo “orgulho de você, fratellino”. Nico dorme sorrindo. (Headcanon realizado.)' },
  { cond: ['plano_ninguem_morre'], texto: '🌟 Epílogo FÃ SUPREMO: os quatro viram lenda — “Os Quatro que Enganaram a Morte”. Novos campistas contam a história ao redor da fogueira, aumentando um pouco a cada ano. Como toda boa lenda.' },
  { cond: ['agon'], texto: '⚖️ Epílogo do Agon: Zeus ainda conta a versão dele (“eu deixei vencerem”). Ninguém acredita. Dioniso vende camisetas “EU SOBREVIVI AO AGON”.' },
  { cond: ['patrulha_rebelde'], texto: '⚔️ Epílogo de Ares: Clarisse aperta a mão de Percy em público. O chalé de Ares registra: “Dia histórico. Testemunhas: todos.”' },
];
