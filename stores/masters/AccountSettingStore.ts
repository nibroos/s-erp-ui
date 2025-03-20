import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { FormAccountSettingType } from '~/types/masters/AccountSettingType'

const useAccountSettingStore = defineStore('AccountSettingStore', {
  state: () => ({
    form: {
      id: null,
      name: '',
      username: '',
      phone_number: '',
      address: '',
      email: '',
      password: '',
      password_confirmation: '',
      profile_image: null,
      profile_image_url: null,
      roles: [],
    } as FormAccountSettingType,
    queryModal: {
    },
    metaModal: {
      index: {
        data: [] as any,
        loading: false,
        meta: {} as Meta
      } as PaginationMeta,
    },
    tabFormIndex: 0,
    errors: {} as Record<string, any>,
    formLoading: false
  }),

  actions: {
    async show() {
      try {
        const response = await useMyFetch().post(
          '/v1/account-setting/show-account-setting',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
      }
    },

    async update() {
      if (!!this.formLoading) return
      this.formLoading = true

      const isConfirmed = await useAlert.showPopupConfirmation(
        'Are you sure to save this data?',
        'Data will be saved'
      )

      if (!isConfirmed) {
        this.formLoading = false
        return
      }

      try {
        let id = this.form.id

        const formData = new FormData()

        Object.keys(this.form).forEach(key => {
          if (this.form[key] !== null && this.form[key] !== undefined) {
            if (key === 'profile_image' && this.form[key] instanceof File) {
              formData.append(key, this.form[key])
            } 
            else if (key === 'roles' && Array.isArray(this.form[key])) {
              this.form[key].forEach((role, index) => {
                formData.append(`${key}[${index}]`, role)
              })
            }
            else {
              formData.append(key, this.form[key])
            }
          }
        })

        const response = await useMyFetch().post(
          '/v1/account-setting/update-account-setting',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        this.form = JSON.parse(
          JSON.stringify(useInitials.formAccountSettingEdit)
        )    

        this.form.id = id
        this.show()

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)

        return response
      } catch (error: any) {
        const responseData = error.response.data
        console.log('Failed To Create Data', error.response.data)
        let errors = ''

        if (typeof responseData.errors === 'object') {
          await Promise.all(
            Object.keys(responseData.errors).map((row: any) => {
              errors += `- ${responseData.errors[row][0]} <br />`
              this.errors[row] = responseData.errors[row][0]
            })
          )
        }
        useAlert.alertError(errors + `<br /> ${responseData.message}`)

        return error.response.data
      } finally {
        this.formLoading = false
      }
    },
  },
  persist: [
    {
      paths: ['queryModal'],
      storage: localStorage
    }
  ]
})

export default useAccountSettingStore
