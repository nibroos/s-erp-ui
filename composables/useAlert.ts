import Swal from 'sweetalert2'

const alertSuccess = (message?: string | null, title?: string | null) => {
  Swal.fire({
    title: title || 'Success',
    text: message || 'Successfully',
    showConfirmButton: true,
    icon: 'success',
    showCloseButton: true,
    timer: 2000,
    customClass: {
      popup: 'p-3',
      container: '',
      actions: 'flex gap-3 w-full',
      confirmButton:
        '!bg-[#977669] transition-all ease-in-out hover:!bg-[#846358] text-white grow'
    }
  })
}

const alertLoading = () => {
  Swal.fire({
    title: 'Loading',
    html: 'Please Wait',
    icon: 'warning',
    didOpen: () => {
      Swal.showLoading()
    }
  })
}

type LoadingOptions = {
  title?: string;
  html?: string;
  icon?: 'warning' | 'error' | 'success' | 'info' | 'question';
  allowOutsideClick?: boolean;
}

const alertLoading2 = (options: LoadingOptions = {}) => {
  Swal.fire({
    title: options.title || 'Loading',
    html: options.html || 'Please Wait',
    icon: options.icon || 'warning',
    allowOutsideClick: options.allowOutsideClick ?? true, // Defaults to true if not provided
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

const showPopupConfirmation = async (
  title?: string,
  text?: string,
  confirButtonText?: string,
  showCancelButton: boolean = true,
  opt?: any
) => {
  return Swal.fire({
    title: title || 'Are you sure want to delete this data?',
    text: text || 'You will no longer see this data.',
    icon: 'warning',
    showCancelButton: showCancelButton,
    confirmButtonColor: '#d33',
    confirmButtonText: confirButtonText || 'Accept',
    cancelButtonText: 'Cancel',
    allowOutsideClick: opt?.hasOwnProperty('allowOutsideClick')
      ? opt.allowOutsideClick
      : true,
    allowEscapeKey: opt?.hasOwnProperty('allowEscapeKey')
      ? opt.allowEscapeKey
      : true,
    allowEnterKey: opt?.hasOwnProperty('allowEnterKey')
      ? opt.allowEnterKey
      : true,
    focusConfirm: true,
    customClass: {
      popup: opt?.customClass?.popup || 'p-3',
      container: opt?.customClass?.container || '',
      actions: opt?.customClass?.actions || 'flex gap-3 !w-full !grow px-3',
      confirmButton:
        opt?.customClass?.confirmButton ||
        '!bg-[#977669] transition-all grow ease-in-out grow hover:!bg-[#846358] text-white',
      cancelButton:
        opt?.customClass?.cancelButton ||
        '!border !border-solid !text-rose-700 !border-rose-700 transition-all grow ease-in-out grow !bg-white hover:!bg-rose-50'
    }
  }).then((result) => result.isConfirmed)
}

const alertSuccessConfirmation = () => {
  Swal.fire({
    title: 'Success',
    text: 'Successfully',
    showConfirmButton: true,
    icon: 'success'
  })
}

const alertLogoutConfirmation = () => {
  Swal.fire({
    title: 'Logout',
    text: 'Are you sure you want to log out?',
    showConfirmButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    showCancelButton: true,
    confirmButtonText: 'Logout',
    icon: 'warning'
  }).then((result) => result.isConfirmed)
}

const alertError = (message?: string | null, opt?: any) => {
  Swal.fire({
    title: opt?.title || 'Error',
    html: message || 'Warning',
    showConfirmButton: opt?.showConfirmButton || true,
    icon: opt?.icon || 'error',
    customClass: {
      popup: 'p-3',
      container: '',
      actions: 'flex gap-3 w-full',
      confirmButton:
        '!bg-[#977669] transition-all ease-in-out hover:!bg-[#846358] text-white grow'
    }
  })
}

const alertWarning = () => {
  Swal.fire({
    title: 'Warning',
    html: 'warning!',
    showConfirmButton: true,
    confirmButtonColor: '#0760ef',
    icon: 'warning'
  })
}

const alertAction = (message: string, title: string, icon: any, opt?: any) => {
  Swal.fire({
    title,
    icon,
    text: message,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    allowOutsideClick: false, // Prevents closing by clicking outside
    allowEscapeKey: false, // Prevents closing with Escape key
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
    customClass: {
      title: opt?.customClass?.title || '!p-0 !m-0 !mb-2 !ml-2',
      popup: opt?.customClass?.popup || '!p-2',
      container: opt?.customClass?.container || '!p-0 !m-0',
      htmlContainer: opt?.customClass?.htmlContainer || '!p-0 !m-0 !ml-2',
    }
  })
}

const hideAlert = () => {
  Swal.close()
}

export const useAlert = {
  alertSuccess,
  alertSuccessConfirmation,
  alertLogoutConfirmation,
  alertError,
  alertWarning,
  hideAlert,
  showPopupConfirmation,
  alertLoading,
  alertLoading2,
  alertAction
}
