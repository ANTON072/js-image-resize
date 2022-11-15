import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Pica from 'pica';

const pica = Pica();

// タテ500xヨコ500内に収める
const MAX_SIZE = 500

function App() {
  const [file, setFile] = useState<any>();

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      const image = new Image()
      const fileUrl = URL.createObjectURL(acceptedFiles[0])
      const canvas = document.createElement('canvas')
      image.onload = async () => {
        const nw = image.naturalWidth
        const nh = image.naturalHeight
        if (nh > nw && nh > MAX_SIZE) {
          // 縦長の場合
          canvas.height = MAX_SIZE
          canvas.width = MAX_SIZE * (nw / nh)
        } else if (
          nw > nh && nw > MAX_SIZE
        ) {
          // 横長の場合
          canvas.width = MAX_SIZE
          canvas.height = MAX_SIZE * (nh / nw)
        } else if (nw === nh && nw > MAX_SIZE) {
          // 正方形の場合
          canvas.width = MAX_SIZE
          canvas.height = MAX_SIZE
        } else {
          // 小さい画像の場合
          canvas.width = nw
          canvas.height = nh
        }

        await pica.resize(image, canvas)
        const resized = canvas.toDataURL("image/png")
        setFile(resized)
      }
      image.src = fileUrl
    }
  })



  return (
    <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      {file && <img src={file} />}
    </section>
  )
}

export default App
