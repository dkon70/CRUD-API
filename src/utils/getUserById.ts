import { DataType } from '../types/types'

function getUserById(arr: DataType[], id: string) {
  return (
    arr.find((obj) => {
      return obj.id === id
    }) || null
  )
}

export default getUserById
