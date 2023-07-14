import { FormContextKey } from '../utils/symbols'
import { createObjectValueByKey, getValueByProperty } from '../utils/common'
import type { FormOptions, FieldContext, FormContext, FormData, FormFields, FieldData, FieldErrors } from '../types'
import { provide, reactive, toRefs, isRef, toRaw } from '#imports'

export function useForm (options: FormOptions) {
  const registeredFields = reactive([]) as FieldContext[]

  const formData = reactive<FormData>({
    valid: false,
    errors: [],
    value: {}
  })

  let initialData = options.initialData ? Object.assign({}, isRef(options.initialData) ? options.initialData.value : options.initialData) : {}

  const bind = (field: FieldContext) => {
    field.initializeData(initialData)
    registeredFields.push(field)
  }

  const unbind = (name: string) => {
    const index = registeredFields.findIndex(field => field.name === name)
    if (index > -1) {
      registeredFields.splice(index, 1)
    }
  }

  const validate = async (fieldName: string | null = null) => {
    console.log('validate form', fieldName)
    const formFields = {} as FormFields
    // reset form data
    formData.valid = true
    formData.errors = []

    // validate fields
    for (const field of registeredFields) {
      const fieldData = await field.validate()
      if (!fieldData.valid) {
        formData.valid = false
      }
      /**
       * Create objects
       */
      // add field values to formData
      createObjectValueByKey(formData.value, field.name, fieldData.value)
      // add field errors to formData
      formData.errors = formData.errors.concat(fieldData.errors)
      // add all field data to formFields
      createObjectValueByKey(formFields, field.name, fieldData)
    }

    // form validate if schema is defined
    if (options.schema) {
      const schemaResult = options.schema.safeParse(formData.value)
      if (!schemaResult.success) {
        formData.valid = false
        // add Error to formErrors
        const errors = schemaResult.error.format()
        for (const field of registeredFields) {
          if (fieldName && fieldName !== field.name) { continue }
          const fieldErrors = getValueByProperty<FieldErrors>(errors, field.name)
          if (fieldErrors) {
            // TODO: add error message interpolation
            formData.errors = formData.errors.concat(fieldErrors?._errors)
            field.setErrors(fieldErrors?._errors || [])
            // change field
            const currentField = getValueByProperty<FieldData>(formFields, field.name)
            currentField.errors = currentField.errors.concat(fieldErrors?._errors || [])
            currentField.valid = false
          } else {
            //check if rule based validation is valid
            const currentField = getValueByProperty<FieldData>(formFields, field.name)
            if (currentField.valid) {
              field.setValid(true)
            }
          }
        }
      } else {
        // check if rule based validation is valid
        let isFormDataValid = true
        for (const field of registeredFields) {
          const currentField = getValueByProperty<FieldData>(formFields, field.name)
          if (currentField.valid) {
            field.setValid(true)
          }else{
            isFormDataValid = false
          }
        }
        formData.valid = isFormDataValid
      }
    }

    // return a non reactive copy of formData and formFields
    const rawFormData = toRaw(formData)
    return {
      ...structuredClone(rawFormData),
      fields: formFields
    }
  }

  const getData = () => {
    const data = {}
    for (const field of registeredFields) {
      createObjectValueByKey(data, field.name, field.getData())
    }
    return data
  }

  const reset = () => {
    for (const field of registeredFields) {
      field.reset()
    }
  }

  provide<FormContext>(FormContextKey, {
    isFormValidation: !!options.schema,
    getData,
    reset,
    validate,
    bind,
    unbind
  })

  const initializeData = (data: unknown) => {
    const initialData = data ? Object.assign({}, data) : null
    for (const field of registeredFields) {
      field.initializeData(initialData)
    }
  }

  const handleSubmit = async () => {
    const result = await validate()
    if (result.valid) {
      // clear form data
      if (options.clearOnSubmit) {
        initializeData({})
      }
    }
    return result
  }


  return {
    ...toRefs(formData),
    getData,
    initializeData,
    validate,
    handleSubmit,
    reset
  }
}
