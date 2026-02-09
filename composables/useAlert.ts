import Swal from 'sweetalert2'

export const useAlert = () => {
    // Custom theme matching Vuetify colors
    const customClass = {
        popup: 'swal-custom-popup',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
    }

    const success = (title: string, text?: string) => {
        return Swal.fire({
            icon: 'success',
            title,
            text,
            customClass,
            confirmButtonColor: '#E91E63',
            timer: 3000,
            timerProgressBar: true,
        })
    }

    const error = (title: string, text?: string) => {
        return Swal.fire({
            icon: 'error',
            title,
            text,
            customClass,
            confirmButtonColor: '#E91E63',
        })
    }

    const warning = (title: string, text?: string) => {
        return Swal.fire({
            icon: 'warning',
            title,
            text,
            customClass,
            confirmButtonColor: '#E91E63',
        })
    }

    const info = (title: string, text?: string) => {
        return Swal.fire({
            icon: 'info',
            title,
            text,
            customClass,
            confirmButtonColor: '#E91E63',
        })
    }

    const confirm = (title: string, text?: string) => {
        return Swal.fire({
            title,
            text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#E91E63',
            cancelButtonColor: '#9C27B0',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            customClass,
        })
    }

    const toast = (title: string, icon: 'success' | 'error' | 'warning' | 'info' = 'success') => {
        return Swal.fire({
            toast: true,
            position: 'top-end',
            icon,
            title,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        })
    }

    const loading = (title: string = 'กำลังโหลด...') => {
        return Swal.fire({
            title,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading()
            },
        })
    }

    return {
        success,
        error,
        warning,
        info,
        confirm,
        toast,
        loading,
    }
}
