# Follow Up від виконавця для людини, котра буде робити ревью:

- За основу взят бойлерплейт (деталі про нього можна прочитати нижче. Оригінальний текст маркдауна збережений), щоб зекономити час. В бойлерплейті вже був сконфігурований Nuxt 3 + ESlint + Prettier + Pinia + TailwindCSS
- В якості мультіселекту був обраний популярний - vue-multiselect
- Зроблені пункти усі крім 3 (графік свічок), так як тестове завдання і так вийшло доволі великим. По часу години 4 пішло на все про все

- useBinanceWebSocketCore.ts представляє собою вебсокет сервіс. Було зроблене правильне встановлення, підтримка та обробка WebSocket-з'єднань, підписка/відписка від потоків даних. Обробка можливих помилок з'єднання. В якості сорса використовувася Бінанс
- useBinanceSocket.ts - фактично композабл, в котрому реалізується вся логіка нормалізації даних з Вебсокет Бінансу. Можна було представити у вигляді якогось сервісу-адаптера, але це не принципово
- useBinancePairs.ts - простий композабл, в котрому фактично рест запит на апі Бінансу для отримання валютних пар + нормалізація даних для подальшої роботи
- ThemeSwitcher.vue - компонент для переключення теми (день, ніч). Доречі всі елементи адаптовані під обидві теми
- CryptoMultiselect.vue - компонент мультіселект, фактично огортка над мультіселектом, апдейт стилів (бо бібліотека в собі вже містить стилі котрі треба було перекрити для більш менш адекватного вигляду)
- SelectedPairInfo.vue + SelectedPairInfoItem.vue - компоненти котрі відповідають за рендер даних з Вебсокету. Розбиті грубо на дві частини, перша огортка де підсвічуються статуси і сам компонент з данними. В продакшені звісно можна було б більш детально підійти до цих елементів
- selectedCurrencies.ts - невеличкий Pinia модуль стору в котрому зберігаються пари валют + синхронізується з локал стореджем.
- types.ts - в утілітах єдиний файл в котрому є інтерфейс валюти котрий багато де використовується
- index.vue - індексова пейджа, в котрій просто збирається два компоненти (мультіселект та блок з інфою про валюти з сокетів).
- Додана анімація зміни значень в валютах, коли отримуємо нові дані з Вебсокету.

В цілому код має багато спрощень, так як було обмеження по часу. Тим не менш намагався продемонструвати рівень володіння та розуміння що тут вібдувається)

Також задеплоїв Live Demo тестової задачі - https://bykova-recruiment-test-task-frontend-7o25m7xmx.vercel.app/

Буду радий попрацювати разом. Дякую за час!


# Nuxt Boilerplate

A ready to use Nuxt 3 boilerplate

**Live Demo**: https://nuxt-boilerplate-main.vercel.app/

**StackBlitz**: https://stackblitz.com/github/renegadevi/nuxt-boilerplate

![screenshot](https://raw.githubusercontent.com/renegadevi/nuxt-boilerplate/main/.github/screenshot.png)
![lighthouse](https://github.com/renegadevi/nuxt-boilerplate/blob/e806bae6efec29a19579d7cf76ef683ffe980917/.github/lighthouse.png)

## Quick setup (TLDR;)

```bash
git clone https://github.com/renegadevi/nuxt-boilerplate.git
cd nuxt-boilerplate
pnpm install
pnpm run dev
```

## Setup

### Prerequisites:

- [pnpm](https://pnpm.io/)
- [mkcert](https://github.com/FiloSottile/mkcert) (Optional localhost HTTPS)

### Clone repo

```bash
git clone https://github.com/renegadevi/nuxt-boilerplate.git
cd nuxt-boilerplate
```

### Install dependencies:

```bash
pnpm install
```

### Optional: `.env`

```ini
VITE_BASE_URL="https://localhost:3000/"
```

### Optional: Generate certificate for HTTPS for localhost

```bash
# mkdir certs
cd certs
mkcert localhost
```

## Start local server

### Start development server

```bash
# HTTP
pnpm run dev
# HTTPS
pnpm run dev-https
```

### Start production build server (HTTP)

```bash
# HTTP
pnpm run build;pnpm run preview
# HTTPS
pnpm run build;pnpm run preview-https
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Nuxt Modules included:

- [eslint](https://nuxt.com/modules/eslint)
- [pinia](https://nuxt.com/modules/pinia)
- [tailwindcss](https://nuxt.com/modules/tailwindcss)
- [i18n](https://nuxt.com/modules/i18n)
- [device](https://nuxt.com/modules/device)
- [devtools](https://nuxt.com/modules/devtools)
- [image](https://nuxt.com/modules/image)
- [google-fonts](https://nuxt.com/modules/google-fonts)
- [color-mode](https://nuxt.com/modules/color-mode)
- [icon](https://nuxt.com/modules/icon)
- [cookie-control](https://nuxt.com/modules/cookie-control)
