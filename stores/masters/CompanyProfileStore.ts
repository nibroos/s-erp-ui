import { useAlert } from '~/composables/useAlert'
import { useMyFetch } from '~/composables/useMyFetch'
import type { Meta, Pagination, PaginationMeta } from '~/interfaces/LaravelPaginationInterface'
import type { FormCompanyProfileType } from '~/types/masters/CompanyProfileType'

const useCompanyProfileStore = defineStore('CompanyProfileStore', {
  state: () => ({
    form: {
      id: null,
      parent_id: null,
      vat_id: null,
      pph23_id: null,
      is_primary: null,
      payment_id: null,
      company_name: '',
      company_owner_name: '',
      company_sign_name: '',
      company_city: '',
      company_province: '',
      company_district: '',
      company_postal_code: '',
      company_address: '',
      company_phone: '',
      company_email: '',
      company_website: '',
      company_sign: null,
      company_logo: null,
      company_description: '',
      company_remark: '',
      company_status: 1,
      company_options_json: null,
      bank_informations: []
    } as FormCompanyProfileType,
    queryModal: {
      qListIndex: {
        page: 1,
        per_page: 10,
        global: '',
        order_column: 'company_name',
        order_direction: 'desc'
      } as Record<string, any>,
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
        if (typeof this.form.id === 'string') {
          this.form.id = parseInt(this.form.id);
        }
        
        const response = await useMyFetch().post(
          '/v1/company-profiles/show-company-profile',
          this.form
        )
        this.form = response.data.data[0]
    
        return response
      } catch (error: any) {
        console.log('Failed To Fetch Data', error.response.data);
      }
    },

    async store() {
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
        const formData = new FormData()

        Object.keys(this.form).forEach(key => {
          if (this.form[key] !== null && this.form[key] !== undefined) {
            if (key === 'company_sign' && this.form[key] instanceof File) {
              formData.append(key, this.form[key])
            } 
            else if (key === 'company_logo' && this.form[key] instanceof File) {
              formData.append(key, this.form[key])
            }
            else if (key === 'bank_informations' && Array.isArray(this.form[key])) {
              formData.append(key, JSON.stringify(this.form[key]))
            }
            else {
              formData.append(key, this.form[key])
            }
          }
        })

        const response = await useMyFetch().post(
          '/v1/company-profiles/create-company-profile',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        
        this.form = JSON.parse(
          JSON.stringify(useInitials.formCompanyProfileCreateEdit)
        )

        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
        navigateTo(`/masters/company-profiles`)

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
          if (key === 'company_sign' || key === 'company_logo') {
            if (this.form[key] === null) {
              formData.append(`${key}_deleted`, '1')
              formData.append(key, '')
            } else if (this.form[key] instanceof File) {
              formData.append(key, this.form[key])
            } else if (this.form[key]) {
              formData.append(key, this.form[key])
            }
          } 
          else if (key === 'bank_informations' && Array.isArray(this.form[key])) {
            formData.append(key, JSON.stringify(this.form[key]))
          }
          else if (this.form[key] !== null && this.form[key] !== undefined) {
            formData.append(key, this.form[key])
          }
        })
    
        const response = await useMyFetch().post(
          '/v1/company-profiles/update-company-profile',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        
        const currentId = this.form.id
    
        this.form = JSON.parse(
          JSON.stringify(useInitials.formCompanyProfileCreateEdit)
        )
    
        useAlert.hideAlert()
        useAlert.alertSuccess(response.data.message)
    
        navigateTo(`/masters/company-profiles/edit/${currentId}`)
    
        this.form.id = currentId
        this.show()
    
        return response
      } catch (error: any) {
        const responseData = error.response.data
        console.log('Failed To Update Data', error.response.data)
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

    async delete(id: number | string | string[] | undefined) {
      this.form.id = id
      try {
        const response = await useMyFetch().post(
          '/v1/company-profiles/delete-company-profile',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Delete Data', error.response.data);
        useAlert.alertError(error.response.data.message)
      }
    },

    async restore(id: number | string | string[] | undefined) {
      this.form.id = id
      try {
        const response = await useMyFetch().post(
          '/v1/company-profiles/restore-company-profile',
          this.form
        )
        this.form = response.data.data[0]

        return response
      } catch (error: any) {
        console.log('Failed To Restore Data', error.response.data);
        useAlert.alertError(error.response.data.message)
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

export default useCompanyProfileStore
