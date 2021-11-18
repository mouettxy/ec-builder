import { Ref } from 'vue'
import { UploadFileInfo } from 'naive-ui'
import { ECNode } from './schema'

export type FileState = 'nofile' | 'uploaded' | 'loading'

export async function fileToJson(file: File) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        try {
          const json = JSON.parse(event.target.result)
          resolve(json)
        } catch (error) {
          reject(error)
        }
      } else {
        reject(new Error('Не удалось прочитать файл'))
      }
    }
    fileReader.onerror = (error) => reject(error)
    fileReader.readAsText(file)
  })
}

export async function uploadSchema(file: UploadFileInfo) {
  const fileState: Ref<FileState> = ref('loading')
  const message = ref('')

  if (file.file) {
    try {
      const parsedFile = (await fileToJson(file.file)) as {
        name: string
        nodes: ECNode[]
      }
      if (!parsedFile.name || !parsedFile.nodes) {
        fileState.value = 'nofile'
        message.value = 'Не удалось загрузить файл'
      } else {
        fileState.value = 'uploaded'
        message.value = 'Файл успешно загружен'

        return { fileState, message, parsedFile }
      }
    } catch (error) {
      fileState.value = 'nofile'
      message.value = 'Не удалось загрузить файл'
    }
  } else {
    fileState.value = 'nofile'
    message.value = 'Не удалось загрузить файл'
  }

  return { fileState, message }
}
