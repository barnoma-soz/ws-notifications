<template>
  <div class="flex items-start justify-center min-h-screen">
    <div class="container p-10">
      <div class="space-y-3">
        <div>
          <label for="access-token">Access Token</label>
          <textarea v-model="accessToken" id="access-token" class="form-textarea w-2/3 h-44" placeholder="Access Token" :disabled="isSubscribed"></textarea>
        </div>

        <div v-if="isSubscribed" class="px-4 py-3 flex items-center space-x-2 rounded-lg bg-green-100 border border-green-400 text-green-700 w-2/3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <span>Вы подписаны</span>
        </div>
        <button v-else @click="subscribe()" type="button" class="btn-primary" :disabled="!canSubscribe">Подписаться</button>
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

<script>
import { computed, ref } from 'vue'

export default {
  setup() {
    const ws = new WebSocket("wss://charmium.ru/noty/notifications");

    ws.onopen = function(e) {
      console.log('Соединение открыто');
    };

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);

      switch (data.type) {
        case 'id':
          id.value = data.id;
          break;

        case 'response':
          if (data.ok) {
            isSubscribed.value = true;
          }
          break;
      }
    };

    const id = ref('');
    const accessToken = ref('');
    
    const isSubscribed = ref(false);
    const canSubscribe = computed(() => id.value && accessToken.value);
    const subscribe = () => {
      ws.send(JSON.stringify({
        "id": id.value,
        "access_token": accessToken.value
      }));
    };

    return {
      accessToken,
      isSubscribed,
      canSubscribe,
      subscribe,
    }
  },
}
</script>

