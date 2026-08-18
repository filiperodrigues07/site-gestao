# Site Gestão Consultorias & Sistemas Integrados

Site institucional da **Gestão Consultorias & Sistemas Integrados** — revenda oficial CH Sistemas e representante autorizado Secullum.

## O que tem no site

- **Home** — apresentação da empresa, diferenciais, novidades da semana, feed do Instagram e chamadas para contato e demonstração.
- **Soluções** — catálogo completo dos módulos de sistema revendidos (ERP, PDV, CRM, Supermercados, Pet Shop, Bares e Restaurantes, entre outros), cada um com sua própria página de detalhes, funcionalidades, benefícios e galeria de telas. Inclui destaque para a marca CH Sistemas e uma seção exclusiva para o Secullum Ponto (controle de ponto eletrônico).
- **Institucional** — quem somos, missão, visão, valores e um carrossel com fotos da equipe e do escritório.
- **Base de Conhecimento** — artigos, categorias, perguntas frequentes, vídeos e downloads (manuais e instaladores) para os clientes consultarem, com busca e filtros.
- **Contato** — formulário de contato e solicitação de demonstração, endereço com mapa, integrado a WhatsApp e e-mail.
- **Área do cliente** (`/area-cliente`) — login por CNPJ e senha para os clientes da Gestão consultarem seus títulos em aberto (contas a receber), gerar cobrança Pix e emitir a 2ª via do boleto, direto pela integração com o CH Sistemas. Senha obrigatória de trocar no primeiro acesso.
- **Tema claro/escuro** — disponível em todo o site, com opção de seguir o tema do sistema operacional.

## Painel administrativo

Em `/admin`, com login próprio e permissões por usuário, a equipe consegue manter o site atualizado sem depender de programação:

- Publicar, editar, duplicar e excluir artigos — inclusive **importando o conteúdo direto de uma URL externa** (extrai e converte para markdown automaticamente)
- Cadastrar categorias, perguntas frequentes, vídeos, downloads, promoções, novidades e publicações do Instagram
- Gerenciar usuários do painel e suas permissões de acesso por tela
- Acompanhar o ranking de publicações da equipe
- **Clientes do portal** — cadastrar/importar clientes da área do cliente, ativar/desativar acessos e redefinir senhas
- **Integrações** — configurar a conexão com o CH Sistemas (e futuras integrações), com teste de conexão embutido

Todas as listagens têm paginação, busca e filtros, preparadas para grandes volumes de registros.

## Como rodar o site no seu computador

```bash
npm install
npm run dev
```

Depois é só abrir [http://localhost:3000](http://localhost:3000) no navegador.

Para usar o painel administrativo localmente, é preciso configurar algumas informações de acesso — veja o arquivo `.env.example` para saber quais e como gerar.
