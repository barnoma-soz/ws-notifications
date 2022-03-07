<template>
  <div class="flex items-start justify-center min-h-screen">
    <div class="container p-10">
      <div class="space-y-3">
        <div>
          <label for="access-token">Access Token</label>
          <textarea v-model="accessToken" id="access-token" class="w-2/3 form-textarea h-44" placeholder="Access Token" :disabled="isSubscribed"></textarea>
        </div>

        <div v-if="isSubscribed" class="flex items-center w-2/3 px-4 py-3 space-x-2 text-green-700 bg-green-100 border border-green-400 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <span>Вы подписаны</span>
        </div>
        <button v-else @click="subscribe()" type="button" class="btn-primary" :disabled="!canSubscribe">Подписаться</button>
      </div>

      <h3 class="mt-12 text-2xl font-semibold">Отправка тестового сообщения</h3>

      <div class="space-y-3">
        <div>
          <label for="subject">Тема</label>
          <input v-model="subject" type="text" id="subject" class="w-1/3 form-input" placeholder="Тема сообщения" />
        </div>

        <div>
          <label for="message">Сообщение</label>
          <textarea v-model="message" id="message" class="w-2/3 form-textarea" placeholder="Текст сообщения"></textarea>
        </div>
        
        <button @click="sendTestMessage()" type="button" class="btn-primary" :disabled="!canSendTestMessage">Отправить</button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import axios from 'axios'
import Toastify from 'toastify-js'

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

            Toastify({
              text: "Вы успешно подписаны",
              className: "success",
            }).showToast();
          }
          break;

        case 'inbox':
          getInboxMessages();
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

    const subject = ref('');
    const message = ref('');
    
    const canSendTestMessage = computed(() => isSubscribed.value && subject.value && message.value);

    const sendTestMessage = () => {
      axios
        .post('/noty/api/private/putInboxMessage', {
          "recipient": "Wpt9X9N5t8K7",
          "subject": subject.value,
          "message": message.value,
        })
        .then(({data}) => {
          if (data.ok) {
            subject.value = '';
            message.value = '';
          }
        });
    }

    const getInboxMessages = () => {
      axios.post('/noty/api/v1/getInboxMessages', {
        access_token: accessToken.value,
        unread_only: true,
      }).then(({data}) => {
        // Пробегаемся по списку сообщений и показываем Toastify

        // Toastify({
        //   text: "",
        //   className: "info",
        // }).showToast();
      });
    }

    return {
      accessToken,

      isSubscribed,
      canSubscribe,
      subscribe,

      subject,
      message,
      canSendTestMessage,
      sendTestMessage,
    }
  },
}
</script>

