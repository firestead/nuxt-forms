<template>
  <div class="container">
    <nav>
      <ul>
        <li>
          <NuxtLink to="/">
            Home
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/zod">
            Zod
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/zod-register">
            Zod Register
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/validation">
            Validation
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/validation-test">
            Validation Test
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/valibot">
            Valibot
          </NuxtLink>
        </li>
      </ul>
    </nav>
    <NuxtPage />
  </div>
</template>
