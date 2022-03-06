<template>
  <div class="flex items-start justify-center min-h-screen">
    <div class="container p-10">
      <div class="space-y-3">
        <div>
          <label for="access-token">Access Token</label>
          <textarea id="access-token" class="form-textarea w-2/3" placeholder="Access Token"></textarea>
        </div>

        <button type="button" class="btn-primary">Подписаться</button>
      </div>

      <h3 class="text-2xl font-semibold mt-12">Отправка тестового сообщения</h3>

      <div class="space-y-3">
        <div>
          <label for="subject">Тема</label>
          <input type="text" id="subject" class="form-input w-1/3" />
        </div>

        <div>
          <label for="message">Сообщение</label>
          <textarea id="message" class="form-textarea w-2/3" placeholder="Текст сообщения"></textarea>
        </div>
        
        <button type="button" class="btn-primary">Отправить</button>
      </div>
    </div>
  </div>
</template>
