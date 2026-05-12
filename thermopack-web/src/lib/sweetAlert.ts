import Swal from 'sweetalert2'

export function showAlert(title: string, text: string, icon: 'success' | 'error' | 'info' | 'question' | 'warning') {
  void Swal.fire({ title, text, icon })
}

export function showConfirmationAlert(
  title: string,
  text: string,
  onConfirm: () => void,
  onRefuse?: () => void
): void {
  void Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) onConfirm()
    else if (onRefuse) onRefuse()
  })
}
