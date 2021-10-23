declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'pdfmake'

interface Window {
  pdfMake: any
}
