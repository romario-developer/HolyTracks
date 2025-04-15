# HolyTracks

Aplicativo para gerenciamento de tracks de músicas para liturgia católica. Permite carregar arquivos separados por instrumento, definir marcações e organizar por tempo litúrgico.

## Recursos

- Upload de arquivos de áudio
- Separação por instrumentos
- Controle individual de volume, mute e solo
- Marcações de seções (introdução, verso, refrão, etc.)
- Organização por tempo litúrgico (Comum, Quaresma, Páscoa, etc.)
- Visualização de letras e cifras

## Tecnologias Utilizadas

- React
- Material-UI
- React Router
- Context API
- Biblioteca Tone.js para manipulação de áudio

## Requisitos

- Node.js 14.0.0 ou superior
- npm 6.0.0 ou superior

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/app-missa.git
cd app-missa
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Abra o navegador e acesse `http://localhost:3000`

## Estrutura do Projeto

```
app-missa/
│
├── public/               # Arquivos estáticos
│
├── src/
│   ├── components/       # Componentes React reutilizáveis
│   │   ├── common/       # Componentes comuns (Header, Footer, etc.)
│   │   ├── upload/       # Componentes para upload de arquivos
│   │   ├── configuration/# Componentes para configuração de música
│   │   ├── finalization/ # Componentes para finalização de upload
│   │   └── player/       # Componentes para o player
│   │
│   ├── context/          # Context API para gerenciamento de estado
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Páginas da aplicação
│   ├── services/         # Serviços e API
│   ├── utils/            # Funções utilitárias
│   ├── App.jsx           # Componente principal
│   ├── index.js          # Ponto de entrada
│   └── routes.js         # Configuração de rotas
│
├── package.json          # Dependências e scripts
└── README.md             # Documentação
```

## Próximos Passos

1. Implementar backend com Node.js e Express
2. Adicionar autenticação de usuários
3. Implementar armazenamento em nuvem para arquivos de áudio
4. Desenvolver versão mobile com React Native
5. Adicionar recursos avançados como loop e equalização

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

## Licença

MIT
