# Site Gestão Consultorias & Sistemas Integrados

Site institucional da **Gestão Consultorias & Sistemas Integrados** — revenda oficial CH Sistemas e representante autorizado Secullum.

## O que tem no site

- **Home** — apresentação da empresa, diferenciais e chamadas para contato e demonstração.
- **Soluções** — catálogo completo dos módulos de sistema revendidos (ERP, PDV, CRM, Supermercados, Pet Shop, Bares e Restaurantes, entre outros), cada um com sua própria página de detalhes, funcionalidades e benefícios. Inclui destaque para a marca CH Sistemas e uma seção exclusiva para o Secullum Ponto (controle de ponto eletrônico).
- **Institucional** — quem somos, missão, visão, valores e um carrossel com fotos da equipe e do escritório.
- **Base de Conhecimento** — artigos, categorias, perguntas frequentes, vídeos e downloads (manuais e instaladores) para os clientes consultarem.
- **Contato** — formulário de contato e solicitação de demonstração, integrado a WhatsApp e e-mail.

## Painel administrativo

Em `/admin`, com login próprio, a equipe consegue manter a Base de Conhecimento sempre atualizada sem depender de programação:

- Publicar, editar e excluir artigos
- Cadastrar categorias, perguntas frequentes e vídeos
- Enviar manuais e instaladores para download pelos clientes

## Como rodar o site no seu computador

```bash
npm install
npm run dev
```

Depois é só abrir [http://localhost:3000](http://localhost:3000) no navegador.

Para usar o painel administrativo localmente, é preciso configurar algumas informações de acesso — veja o arquivo `.env.example` para saber quais e como gerar.
