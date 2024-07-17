# Documentação VEPEMA-DEMO

Este é o guia para instalação, construção e deploy do projeto.  Estão listadas aqui também as funcionalidades implementadas nessa demo.

## Instalação de Dependências

Para instalar as dependências, execute o seguinte comando:
```bash
sudo docker-compose up --build
```

para executar o projeto (web) em localhost:
```bash
    ng serve
```

para buildar o projeto (android):
```bash
    ionic capacitor run android
```

para atualizar a localização do android-studio:
```bash
    export CAPACITOR_ANDROID_STUDIO_PATH=/home/renzo/Programação/android-studio/bin/studio.sh
```


passo a passo para o deploy no Firebase:  
    Atualizar o Firebase.json com o nome do site onde o projeto será deployado  
    Atualizar o .firebaserc com o nome do projeto do firebase  
    Atualizar o app.component.ts com a configuração do Firebase  
    rode o comando npm run build para transpilar seu código para .js a fim de tornar ele deployavel  
    rode o comando firebase login para se certificar que está logado na conta que tem acesso ao projeto especificado em .firebaserc  
    verifique se é necessário usar o firebase init. mas provavelmente não será necessário.  
    rode o comando firebase deploy para enviar a sua versão buildada para o projeto que irá implantar ela no site especificado.  

## Funcionalidades implementadas

Cadastro de Zona de Trabalho:  
O cadastro é meramente simbólico, pois isso seria feito via API, mas uma vez que o sistema reconhece que o usuário selecionou uma zona onde ele não está presente, ele mostra um botão para cadastrar essa nova zona selecionada.  
  
Verificação de Presença do usuário na Zona de Trabalho:  Uma vez selecionada uma zona de trabalho onde o usuário está presente, abre-se um botão para que ele "Bata o Ponto".

Bater Ponto:  Confirmada sua presença na área, uma vez esse botão clicado, o usuário será redirecionado para uma tela onde ele deve fazer envio de uma foto para reconhecimento facial e confirmar se é de fato essa pessoa batendo o ponto.  
