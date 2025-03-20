export type FormWarehouseType = {
  id?: number | null | undefined | string | string[]
  name: string
  username: string
  email: string
  phone_number: string
  address?: string | null
  password?: string | null
  password_confirmation?: string | null
  profile_image?: File | string | null
  profile_image_url?: string | null
  roles?: string[]
}
