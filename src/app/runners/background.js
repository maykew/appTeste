const BackgroundRunner = {
  run: function () {
    console.log("Executando tarefa de fundo...");
    window.dispatchEvent(new Event('myCustomEvent')); // Dispara o evento customizado
    
    // Enviar notificação ao usuário
    if (Notification.permission === 'granted') {
      new Notification('Tarefa de fundo executada', {
        body: 'A tarefa de fundo foi acionada com sucesso!',
      });
    }
  }
};
module.exports = BackgroundRunner;