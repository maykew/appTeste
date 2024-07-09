FROM node:20.14

WORKDIR /app

COPY package*.json ./

# Instalar dependências do projeto
RUN npm install

# Instalar Angular CLI globalmente
RUN npm install -g @angular/cli

COPY . .

# Script de inicialização para verificar dependências
RUN echo 'node_modules' > .dockerignore
RUN echo 'if [ ! -d "node_modules" ]; then npm install; fi' > /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 4200

CMD ["/docker-entrypoint.sh", "ng", "serve", "--host", "0.0.0.0"]
