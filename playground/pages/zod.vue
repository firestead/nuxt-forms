<template>
    <div class="container">
      <article>
      <h1>Zod Example</h1>
        <div class="grid">
          <div>
            <NuxtForm
                :schema="formSchema"
                v-model="modelData">
                <Field name="email" :validate-on-change="true" v-slot="{ valid, errors, updateValue, value}">
                  <label>
                    Email
                    <input type="email" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)"  />
                    <small v-if="!valid">{{errors[0]}}</small>
                  </label>
                </Field>
                <Field name="password" v-slot="{ valid, errors, updateValue, value}">
                  <label>
                    Password
                    <input type="password" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)"  />
                    <small v-if="!valid">{{errors[0]}}</small>
                  </label>  
                </Field>
                <Field name="others.tel" v-slot="{ valid, errors, updateValue, value}">
                    <label>
                      Tel
                      <input type="tel" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)"  />
                      <small v-if="!valid">{{errors[0]}}</small>
                   </label>
                </Field>
                <Field name="url" :schema="testSchema" :validate-on-change="true" v-slot="{ valid, errors, updateValue, value}">
                  <label>
                    Url
                    <input type="text" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).value)"  />
                    <small v-if="!valid">{{errors[0]}}</small>
                  </label>
                </Field>
                <Field name="others.privacy" v-slot="{ valid, errors, updateValue, value}">
                  <fieldset>
                    <label>
                      <input type="checkbox" :value="value" :aria-invalid="!valid ? true : undefined" @input="event => updateValue((event.target as HTMLInputElement).checked)"  />
                      Privacy
                    </label>                    
                    <small v-if="!valid">{{errors[0]}}</small>
                  </fieldset>
                </Field>
                <button type="submit">Submit</button>
            </NuxtForm>
          </div>
          <div></div>
        </div>
      </article>
    </div>
</template>
<script setup lang="ts">
import {z} from 'zod'

const formSchema = z.object({
  email: z.string({invalid_type_error:'Eine E-Mail ist erforderlich'}).email({message: 'Dies ist keine gültige E-Mail'}).default('jo@test.de'),
  password: z.string().min(8, {message: 'Password must be at least 8 characters long'}).max(10).default('12345678'),
  others: z.object({
    tel: z.string({invalid_type_error:'Keine Telefonnummer'}).regex(/^\+49[0-9]{9,12}$/,{
      message: 'Bitte eine gültige Telefonnummer eingeben'
    }).default('+491234567890'),
    privacy: z.boolean({invalid_type_error: 'Privacy nicht gewählt'}).refine(value => value === true, {
      message: 'You must agree to the privacy policy'
    }).optional()
  }).default({})
})

const testSchema = z.string().url({message: 'This is not a valid URL'}).default('https://google.com')

const modelData = ref({
  email: ''
})

</script>