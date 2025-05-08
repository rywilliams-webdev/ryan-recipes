import placeholderImg from '@/assets/placeholder.png'

export function usePlaceholderImage() {
  const placeholderImage = (event) => {
    event.target.src = placeholderImg
  }

  return { placeholderImage }
}
